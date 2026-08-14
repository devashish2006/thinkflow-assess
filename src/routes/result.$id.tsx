import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { ResultBreakdown } from "@/components/ResultBreakdown";
import { supabase } from "@/integrations/supabase/client";
import type { Submission } from "@/lib/assess";

export const Route = createFileRoute("/result/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your Result — Maventic Assess" },
      { name: "description", content: "AI-evaluated score and feedback for your submission." },
      { property: "og:title", content: "Your Result — Maventic Assess" },
      {
        property: "og:description",
        content: "AI-evaluated score and feedback for your submission.",
      },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["submission", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Submission;
    },
  });

  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading result...</p> : null}
        {error ? <p className="text-sm text-destructive">Could not load this result.</p> : null}
        {data ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
              <h1 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Your Result
              </h1>
              <p className="mt-3 text-5xl font-bold text-primary">{data.total_score} / 100</p>
              <p
                className={`mt-4 inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                  data.total_score >= 70
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {data.total_score >= 70 ? "SHORTLISTED" : "NOT SHORTLISTED"}
              </p>
            </div>
            <ResultBreakdown s={data} />
            <Link
              to="/student"
              className="inline-block rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Back to dashboard
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
