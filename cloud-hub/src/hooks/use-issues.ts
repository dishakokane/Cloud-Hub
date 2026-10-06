import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export type IssueType = "Network" | "Storage" | "Server" | "Hardware" | "Software";
export type IssueStatus = "Pending" | "In Progress" | "Solved";
export type IssuePriority = "Low" | "Medium" | "High";

export interface Issue {
  id: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: IssueType;
  description: string;
  imageUrl: string | null;
  location: { lat: number; lng: number; label: string } | null;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: any;
  updatedAt: any;
}

export function useIssues() {
  const { user, role } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Avoid composite indexes: for users we filter by userId only and sort client-side.
    const q =
      role === "user"
        ? query(collection(db, "issues"), where("userId", "==", user.uid))
        : query(collection(db, "issues"), orderBy("createdAt", "desc"));

    let initialLoad = true;
    let prevIssuesMap = new Map<string, IssueStatus>();

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newIssues: Issue[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Issue, "id">;
        newIssues.push({ id: docSnap.id, ...data });

        // Notify user on status change
        if (!initialLoad && role === "user") {
          const prevStatus = prevIssuesMap.get(docSnap.id);
          if (prevStatus && prevStatus !== data.status) {
            toast.success(`Ticket ${data.ticketId} is now ${data.status}`);
          }
        }
      });

      // Sort client-side by createdAt desc (handles missing serverTimestamp gracefully)
      newIssues.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });

      // Update map for next diff
      prevIssuesMap = new Map(newIssues.map((i) => [i.id, i.status]));

      setIssues(newIssues);
      setLoading(false);
      initialLoad = false;
    });

    return () => unsubscribe();
  }, [user, role]);

  const reportIssue = async (data: {
    type: IssueType;
    description: string;
    imageFile?: File | null;
    location?: { lat: number; lng: number; label: string } | null;
  }) => {
    if (!user) throw new Error("Not authenticated");

    const ticketId = `CH-${Math.floor(10000 + Math.random() * 90000)}`;
    let imageUrl = null;

    if (data.imageFile) {
      const storageRef = ref(storage, `issues/${user.uid}/${ticketId}-${data.imageFile.name}`);
      await uploadBytes(storageRef, data.imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "issues"), {
      ticketId,
      userId: user.uid,
      userEmail: user.email || "",
      userName: user.displayName || "Unknown User",
      type: data.type,
      description: data.description,
      imageUrl,
      location: data.location || null,
      status: "Pending",
      priority: "Medium",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return ticketId;
  };

  const updateIssueStatus = async (id: string, status: IssueStatus) => {
    await updateDoc(doc(db, "issues", id), {
      status,
      updatedAt: serverTimestamp(),
    });
  };

  const updateIssuePriority = async (id: string, priority: IssuePriority) => {
    await updateDoc(doc(db, "issues", id), {
      priority,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteIssue = async (id: string) => {
    await deleteDoc(doc(db, "issues", id));
  };

  return {
    issues,
    loading,
    reportIssue,
    updateIssueStatus,
    updateIssuePriority,
    deleteIssue
  };
}
