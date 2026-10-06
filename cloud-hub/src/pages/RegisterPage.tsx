import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLocation, Link } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Cloud,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const [, setLocation] = useLocation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await registerUser(email, password, name);
      toast.success("Welcome to Cloud Hub");
      setLocation("/user/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  })();
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-muted",
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 min-h-screen w-full grid lg:grid-cols-[1.1fr_1fr]">
        {/* Left — brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
        >
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

          <Link href="/login" className="relative z-10 flex items-center gap-3 hover:opacity-90 transition-opacity w-fit">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Cloud Hub</span>
          </Link>

          <div className="relative z-10 space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-xs font-medium text-blue-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              Free for individuals
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight"
            >
              Start managing your
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-emerald-300 bg-clip-text text-transparent">
                cloud issues today.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base text-blue-50/80 max-w-md leading-relaxed"
            >
              Create an account in seconds and report your first issue with screenshots, location and real-time tracking.
            </motion.p>

            <ul className="space-y-3 pt-2">
              {[
                "Auto-generated ticket IDs for every report",
                "Real-time status updates from admin team",
                "Smart filters and chatbot-assisted FAQs",
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-blue-400/15 p-1 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-blue-300" />
                  </div>
                  <span className="text-blue-50/90 text-[15px]">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 text-xs text-blue-100/60">
            &copy; {new Date().getFullYear()} Cloud Hub &middot; Built for operations teams
          </div>
        </motion.div>

        {/* Right — form */}
        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden flex flex-col items-center mb-6 text-center">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-2xl shadow-lg shadow-blue-500/40 mb-3">
                <Cloud className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Cloud Hub</h1>
            </div>

            <Card className="border-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl bg-white/[0.97] dark:bg-slate-900/80">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Join Cloud Hub and start reporting issues
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      autoComplete="name"
                      className="h-11"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
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
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <PasswordInput
                      id="password"
                      placeholder="At least 6 characters"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {password && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i <= passwordStrength ? strengthColors[passwordStrength] : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Strength:{" "}
                          <span className="font-medium text-foreground">
                            {strengthLabels[passwordStrength]}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Re-enter password"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground pt-1">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-semibold hover:underline">
                      Sign in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-white/60 lg:text-muted-foreground mt-6">
              By creating an account you agree to our terms.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
