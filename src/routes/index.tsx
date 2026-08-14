import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login, saveSession } from "@/lib/assess";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maventic Assess — AI Candidate Evaluation" },
      {
        name: "description",
        content:
          "Maventic Assess evaluates how candidates think, not just how their code runs. AI-scored DSA screening.",
      },
      { property: "og:title", content: "Maventic Assess — AI Candidate Evaluation" },
      {
        property: "og:description",
        content: "Evaluate how candidates think, not just how their code runs.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session = login(email, password);
    if (!session) {
      setError("Invalid credentials.");
      return;
    }
    saveSession(session);
    navigate({ to: session.role === "admin" ? "/admin" : "/student" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Maventic <span className="text-primary">Assess</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Evaluate how candidates think, not just how their code runs.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="student@maventic.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
              required
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </button>

          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Demo accounts</p>
            <p>Student: student@maventic.com / student123</p>
            <p>Admin: admin@maventic.com / admin123</p>
          </div>
        </form>
      </div>
    </main>
  );
}
