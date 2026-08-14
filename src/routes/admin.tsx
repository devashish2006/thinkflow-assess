import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ResultBreakdown } from "@/components/ResultBreakdown";
import { supabase } from "@/integrations/supabase/client";
import { TEST_INFO, getSession, type Submission } from "@/lib/assess";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Maventic Assess" },
      { name: "description", content: "Review AI-evaluated candidate results and submissions." },
      { property: "og:title", content: "Admin Dashboard — Maventic Assess" },
      {
        property: "og:description",
        content: "Review AI-evaluated candidate results and submissions.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "admin") navigate({ to: "/" });
  }, [navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Submission[];
    },
  });

  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader subtitle="Admin console" />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold">{TEST_INFO.name}</h1>
          <p className="text-sm text-muted-foreground">Candidate Results</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={3}>
                    Loading...
                  </td>
                </tr>
              ) : data && data.length ? (
                data.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-accent"
                  >
                    <td className="px-4 py-3 font-medium">{s.student_name}</td>
                    <td className="px-4 py-3">{s.total_score} / 100</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          s.total_score >= 70
                            ? "bg-primary/10 text-primary"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {s.total_score >= 70 ? "SHORTLISTED" : "NOT SHORTLISTED"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={3}>
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selected ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selected.student_name}</h2>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
              >
                Close
              </button>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Thought Process / Pseudocode
              </h3>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-3 font-mono text-sm">
                {selected.pseudocode || "—"}
              </pre>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Code ({selected.language})
              </h3>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-foreground/95 p-3 font-mono text-sm text-background">
                {selected.code || "—"}
              </pre>
            </div>

            <ResultBreakdown s={selected} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
