import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/notifications-context";
import {
  Cloud,
  LogOut,
  Menu,
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  Bot,
  Bell,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const NAV_ITEMS = [
  { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/report", label: "Report Issue", icon: PlusCircle },
  { href: "/user/issues", label: "My Issues", icon: ListChecks },
  { href: "/user/chatbot", label: "Chatbot", icon: Bot },
];

function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  return (
    <Popover onOpenChange={(open) => { if (open && unreadCount > 0) markAllRead(); }}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/40"
        >
          <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 px-1 text-[10px] font-bold text-white shadow-sm shadow-red-500/30 ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <h4 className="font-semibold text-sm">Notifications</h4>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[11px] flex items-center gap-1 text-white/80 hover:text-white transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-blue-100/90 mt-0.5">
            {notifications.length === 0
              ? "You're all caught up"
              : `${notifications.length} update${notifications.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll be notified when admin updates your tickets.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <ul className="divide-y">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "px-4 py-3 flex items-start gap-3 hover:bg-muted/40 transition-colors",
                    !n.read && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-bold uppercase",
                      n.status === "Solved"
                        ? "bg-gradient-to-br from-emerald-500 to-green-600"
                        : n.status === "In Progress"
                        ? "bg-gradient-to-br from-amber-500 to-orange-600"
                        : "bg-gradient-to-br from-slate-500 to-slate-700"
                    )}
                  >
                    {n.status === "Solved" ? "OK" : n.status === "In Progress" ? "WIP" : "•"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      Ticket <span className="font-semibold">{n.ticketId}</span> is now{" "}
                      <span className="font-semibold">{n.status}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const initials = (user?.displayName || user?.email || "U")
    .split(/\s+|@/)[0]
    .slice(0, 2)
    .toUpperCase();

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {NAV_ITEMS.map((item) => {
        const active = location === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-2 text-sm font-medium transition-all rounded-md",
              mobile ? "px-3 py-2.5" : "px-3 py-1.5",
              active
                ? "bg-blue-100/70 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Icon className={cn("h-4 w-4 transition-transform", active ? "text-blue-600" : "group-hover:scale-110")} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/40 dark:from-slate-950 dark:to-blue-950/30 flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-blue-100/60 dark:border-blue-900/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/user/dashboard" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-md shadow-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-shadow">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:inline-block bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Cloud Hub
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-blue-200/60 shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:text-white"
                >
                  <span className="text-xs font-bold">{initials}</span>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-6">
                  <div className="flex items-center gap-2.5 px-2">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-md shadow-blue-500/30">
                      <Cloud className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                      Cloud Hub
                    </span>
                  </div>
                  <nav className="flex flex-col gap-1.5 px-2">
                    <NavLinks mobile />
                  </nav>
                  <div className="px-2 pt-4 border-t">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{user?.displayName || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
