import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import type { IssueStatus } from "@/hooks/use-issues";

export interface AppNotification {
  id: string;
  ticketId: string;
  status: IssueStatus;
  message: string;
  createdAt: number;
  read: boolean;
}

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

const SEEN_KEY = (uid: string) => `cloudhub_seen_${uid}`;
const NOTIFS_KEY = (uid: string) => `cloudhub_notifs_${uid}`;

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Hydrate from localStorage on user change
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const raw = localStorage.getItem(NOTIFS_KEY(user.uid));
      if (raw) setNotifications(JSON.parse(raw));
      else setNotifications([]);
    } catch {
      setNotifications([]);
    }
  }, [user]);

  // Persist whenever notifications change
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(NOTIFS_KEY(user.uid), JSON.stringify(notifications.slice(0, 50)));
    } catch {}
  }, [notifications, user]);

  // Listen to user's issues and detect status changes
  useEffect(() => {
    if (!user || role !== "user") return;

    const q = query(collection(db, "issues"), where("userId", "==", user.uid));
    let initialLoad = true;

    const unsub = onSnapshot(q, (snapshot) => {
      let seenMap: Record<string, IssueStatus> = {};
      try {
        const raw = localStorage.getItem(SEEN_KEY(user.uid));
        if (raw) seenMap = JSON.parse(raw);
      } catch {}

      const newNotifs: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as { ticketId: string; status: IssueStatus };
        const prev = seenMap[docSnap.id];

        if (!initialLoad && prev && prev !== data.status) {
          const notif: AppNotification = {
            id: `${docSnap.id}-${Date.now()}`,
            ticketId: data.ticketId,
            status: data.status,
            message: `Ticket ${data.ticketId} status changed to ${data.status}`,
            createdAt: Date.now(),
            read: false,
          };
          newNotifs.push(notif);
          toast.success(notif.message);
        }
        seenMap[docSnap.id] = data.status;
      });

      try {
        localStorage.setItem(SEEN_KEY(user.uid), JSON.stringify(seenMap));
      } catch {}

      if (newNotifs.length > 0) {
        setNotifications((prev) => [...newNotifs, ...prev].slice(0, 50));
      }
      initialLoad = false;
    });

    return () => unsub();
  }, [user, role]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
