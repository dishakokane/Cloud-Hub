import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationsProvider } from "@/lib/notifications-context";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import SplashRedirect from "@/pages/SplashRedirect";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import UserDashboard from "@/pages/UserDashboard";
import ReportIssuePage from "@/pages/ReportIssuePage";
import MyIssuesPage from "@/pages/MyIssuesPage";
import ChatbotPage from "@/pages/ChatbotPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminIssuesPage from "@/pages/AdminIssuesPage";
import NotFound from "@/pages/not-found";

// Layouts
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { AdminShell } from "@/components/AdminShell";

const queryClient = new QueryClient();

// Page transition wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={SplashRedirect} />
        
        {/* Auth routes */}
        <Route path="/login">
          <PageWrapper><LoginPage /></PageWrapper>
        </Route>
        <Route path="/register">
          <PageWrapper><RegisterPage /></PageWrapper>
        </Route>
        <Route path="/forgot-password">
          <PageWrapper><ForgotPasswordPage /></PageWrapper>
        </Route>

        {/* User routes */}
        <Route path="/user/dashboard">
          <RequireAuth role="user">
            <AppShell>
              <PageWrapper><UserDashboard /></PageWrapper>
            </AppShell>
          </RequireAuth>
        </Route>
        <Route path="/user/report">
          <RequireAuth role="user">
            <AppShell>
              <PageWrapper><ReportIssuePage /></PageWrapper>
            </AppShell>
          </RequireAuth>
        </Route>
        <Route path="/user/issues">
          <RequireAuth role="user">
            <AppShell>
              <PageWrapper><MyIssuesPage /></PageWrapper>
            </AppShell>
          </RequireAuth>
        </Route>
        <Route path="/user/chatbot">
          <RequireAuth role="user">
            <AppShell>
              <PageWrapper><ChatbotPage /></PageWrapper>
            </AppShell>
          </RequireAuth>
        </Route>

        {/* Admin routes */}
        <Route path="/admin/dashboard">
          <RequireAuth role="admin">
            <AdminShell>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </AdminShell>
          </RequireAuth>
        </Route>
        <Route path="/admin/issues">
          <RequireAuth role="admin">
            <AdminShell>
              <PageWrapper><AdminIssuesPage /></PageWrapper>
            </AdminShell>
          </RequireAuth>
        </Route>

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationsProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </NotificationsProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
