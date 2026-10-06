import { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export function RequireAuth({
  role,
  children,
}: {
  role?: "user" | "admin";
  children: ReactNode;
}) {
  const { user, role: userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (role && userRole !== role) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
