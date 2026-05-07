import { Link, useRouter } from "@tanstack/react-router";
import { Moon, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-2 shadow-glow">
            <Moon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl tracking-tight text-foreground">Sukoon</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/reminders"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Reminders
          </Link>
          <Link
            to="/music"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Chill Music
          </Link>
          <Link
            to="/favorites"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Favorites
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
