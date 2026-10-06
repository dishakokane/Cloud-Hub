import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLocation, Link } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Cloud,
  Loader2,
  ShieldCheck,
  Zap,
  Bell,
  BarChart3,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser, loginAdmin } = useAuth();
  const [, setLocation] = useLocation();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success("Welcome back");
      setLocation("/user/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(adminEmail, adminPassword);
      toast.success("Welcome, Admin");
      setLocation("/admin/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign in as admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 min-h-screen w-full grid lg:grid-cols-[1.1fr_1fr]">
        {/* Left — brand panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
        >
          {/* Floating clouds */}
          <motion.div
            className="absolute top-24 right-16 text-white/10"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="h-32 w-32" strokeWidth={1.2} />
          </motion.div>
          <motion.div
            className="absolute bottom-40 right-40 text-white/[0.07]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Cloud className="h-24 w-24" strokeWidth={1.2} />
          </motion.div>
          <motion.div
            className="absolute top-1/2 left-8 text-white/[0.06]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Cloud className="h-28 w-28" strokeWidth={1.2} />
          </motion.div>

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Cloud Hub</span>
          </div>

          {/* Hero */}
          <div className="relative z-10 space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-xs font-medium text-blue-100"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>
              Live issue management
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight"
            >
              Resolve cloud issues
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-emerald-300 bg-clip-text text-transparent">
                faster, together.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base text-blue-50/80 max-w-md leading-relaxed"
            >
              Report, track and resolve network, storage and server issues in real-time — with smart analytics and instant notifications.
            </motion.p>

            <div className="grid grid-cols-2 gap-2.5 max-w-md pt-2">
              {[
                { icon: Zap, label: "Real-time updates" },
                { icon: Bell, label: "Smart alerts" },
                { icon: BarChart3, label: "Live analytics" },
                { icon: ShieldCheck, label: "Secure by default" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                  className="group flex items-center gap-2.5 bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2.5 hover:bg-white/[0.08] hover:border-blue-400/30 transition-all"
                >
                  <div className="bg-blue-400/10 p-1.5 rounded-lg group-hover:bg-blue-400/20 transition-colors">
                    <item.icon className="h-3.5 w-3.5 text-blue-300" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer with stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 flex items-center gap-6 text-blue-100/60"
          >
            <div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-xs">Uptime</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-white">&lt; 2m</div>
              <div className="text-xs">Avg response</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs">Monitoring</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — form panel */}
        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Mobile brand */}
            <div className="lg:hidden flex flex-col items-center mb-6 text-center">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-2xl shadow-lg shadow-blue-500/40 mb-3">
                <Cloud className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Cloud Hub</h1>
              <p className="text-sm text-blue-100/70 mt-1">Centralized cloud issue management</p>
            </div>

            <Card className="border-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl bg-white/[0.97] dark:bg-slate-900/80">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sign in to continue to your dashboard
                  </p>
                </div>

                <Tabs defaultValue="user" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-5 h-11 bg-muted/60">
                    <TabsTrigger value="user" className="text-sm font-medium">
                      User
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="text-sm font-medium">
                      <Lock className="h-3.5 w-3.5 mr-1.5" />
                      Admin
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="user" className="mt-0">
                    <form onSubmit={handleUserLogin} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="user-email" className="text-sm">Email</Label>
                        <Input
                          id="user-email"
                          type="email"
                          placeholder="name@example.com"
                          required
                          autoComplete="email"
                          className="h-11"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="user-password" className="text-sm">Password</Label>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-primary font-medium hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <PasswordInput
                          id="user-password"
                          placeholder="Enter your password"
                          required
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-11 text-base font-semibold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20 group"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </Button>
                      <div className="text-center text-sm text-muted-foreground pt-1">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary font-semibold hover:underline">
                          Sign up
                        </Link>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="admin" className="mt-0">
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div className="rounded-lg border border-amber-200/70 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 px-3 py-2.5 flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                          Admin access is restricted. Use authorized credentials.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="admin-email" className="text-sm">Admin Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@cloudhub.com"
                          required
                          autoComplete="email"
                          className="h-11"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="admin-password" className="text-sm">Password</Label>
                        <PasswordInput
                          id="admin-password"
                          placeholder="Enter admin password"
                          required
                          autoComplete="current-password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-11 text-base font-semibold mt-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white shadow-lg shadow-slate-900/20"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Sign In as Admin
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground pt-1">
                        Admin access only. No public registration.
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-white/60 lg:text-muted-foreground mt-6">
              Secured by Firebase Authentication
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
