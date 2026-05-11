import { Link, useRouter } from "@tanstack/react-router";
import { BookOpen, LogIn, LogOut, Heart, Moon, Sparkles, Bell, Music2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
  };

  const navLink = "flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm sm:px-3";

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="group flex flex-none items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-2 shadow-glow">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg tracking-tight text-foreground sm:text-xl">
            Al-Quran
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 overflow-x-auto sm:gap-1">
          <Link to="/" className={navLink} activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>
            <BookOpen className="h-3.5 w-3.5 sm:hidden" />
            <span className="hidden sm:inline">Surahs</span>
          </Link>
          <Link to="/namaz" className={navLink} activeProps={{ className: "text-foreground" }}>
            <Moon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Namaz</span>
          </Link>
          <Link to="/tasbih" className={navLink} activeProps={{ className: "text-foreground" }}>
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tasbih</span>
          </Link>
          <Link to="/favorites" className={navLink} activeProps={{ className: "text-foreground" }}>
            <Heart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Favorites</span>
          </Link>
          <Link to="/settings/notifications" className={navLink} activeProps={{ className: "text-foreground" }}>
            <Bell className="h-3.5 w-3.5" />
          </Link>
          {user ? (
            <button
              onClick={signOut}
              className="ml-1 flex flex-none items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="ml-1 flex flex-none items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
