import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Cloud, LogOut, Menu, LayoutDashboard, Inbox, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/issues", label: "All Issues", icon: Inbox },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

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
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Icon className={cn("h-4 w-4 transition-transform", active ? "text-primary" : "group-hover:scale-110")} />
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
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-md shadow-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-shadow">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:inline-block bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Cloud Hub
              </span>
              <Badge className="ml-1 bg-gradient-to-r from-rose-500 to-red-600 text-white border-0 shadow-sm shadow-red-500/20 hover:from-rose-600 hover:to-red-700">
                <Shield className="h-3 w-3 mr-1" />
                ADMIN
              </Badge>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-blue-200/60 shadow-sm bg-gradient-to-br from-slate-700 to-slate-900 text-white hover:from-slate-800 hover:to-black hover:text-white"
                >
                  <Shield className="h-4 w-4" />
                  <span className="sr-only">Admin menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || "System Admin"}</p>
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
