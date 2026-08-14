import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { TEST_INFO, getSession } from "@/lib/assess";

export const Route = createFileRoute("/student")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Student Dashboard — Maventic Assess" },
      { name: "description", content: "Start your Maventic DSA screening test." },
      { property: "og:title", content: "Student Dashboard — Maventic Assess" },
      { property: "og:description", content: "Start your Maventic DSA screening test." },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "student") navigate({ to: "/" });
    else setName(s.name);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Welcome{name ? `, ${name}` : ""}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your assigned assessment</p>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{TEST_INFO.name}</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Row label="College" value={TEST_INFO.college} />
            <Row label="Duration" value={TEST_INFO.duration} />
            <Row label="Questions" value={String(TEST_INFO.questions)} />
            <Row label="Passing Score" value={String(TEST_INFO.passingScore)} />
          </dl>
          <button
            onClick={() => navigate({ to: "/test" })}
            className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Test
          </button>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
