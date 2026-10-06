import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import { auth, ADMIN_EMAIL, ADMIN_PASSWORD } from "./firebase";
import { useToast } from "@/hooks/use-toast";

type Role = "user" | "admin" | null;

interface AuthContextType {
  user: FirebaseUser | null;
  role: Role;
  loading: boolean;
  loginUser: (e: string, p: string) => Promise<void>;
  loginAdmin: (e: string, p: string) => Promise<void>;
  registerUser: (e: string, p: string, n: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (e: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setRole(currentUser.email === ADMIN_EMAIL ? "admin" : "user");
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginUser = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginAdmin = async (email: string, password: string) => {
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error("Invalid admin credentials.");
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: "System Admin" });
        }
      } else {
        throw error;
      }
    }
  };

  const registerUser = async (email: string, password: string, name: string) => {
    if (email === ADMIN_EMAIL) {
      throw new Error("Cannot register with the admin email.");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await firebaseSendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginUser, loginAdmin, registerUser, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
