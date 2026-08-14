import { Link, useNavigate } from "@tanstack/react-router";
import { clearSession } from "@/lib/assess";

export function AppHeader({ subtitle }: { subtitle?: string }) {
  const navigate = useNavigate();
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="leading-tight">
          <span className="text-lg font-bold text-foreground">
            Maventic <span className="text-primary">Assess</span>
          </span>
          <p className="text-xs text-muted-foreground">
            {subtitle ?? "Evaluate how candidates think, not just how their code runs."}
          </p>
        </Link>
        <button
          onClick={() => {
            clearSession();
            navigate({ to: "/" });
          }}
          className="rounded-md border border-input px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
