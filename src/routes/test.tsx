import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { LANGUAGES, QUESTION, getSession } from "@/lib/assess";
import { evaluateSubmission } from "@/lib/evaluate.functions";

export const Route = createFileRoute("/test")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "DSA Screening Test — Maventic Assess" },
      {
        name: "description",
        content: "Write your thought process and code for the Maventic DSA screening question.",
      },
      { property: "og:title", content: "DSA Screening Test — Maventic Assess" },
      {
        property: "og:description",
        content: "Write your thought process and code for the Maventic DSA screening question.",
      },
    ],
  }),
  component: TestPage,
});

function TestPage() {
  const navigate = useNavigate();
  const evaluate = useServerFn(evaluateSubmission);
  const [studentName, setStudentName] = useState("");
  const [pseudocode, setPseudocode] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "student") navigate({ to: "/" });
    else setStudentName(s.name);
  }, [navigate]);

  const onSubmit = async () => {
    if (!window.confirm("Are you sure? You cannot edit your solution after submission.")) return;
    setSubmitted(true);
    setLoading(true);
    setError("");
    try {
      const result = await evaluate({
        data: {
          studentName,
          question: QUESTION.description,
          expectedApproach: QUESTION.expectedApproach,
          pseudocode,
          code,
          language,
        },
      });
      navigate({ to: "/result/$id", params: { id: result.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Evaluation failed. Please try again.");
      setLoading(false);
      setSubmitted(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/40">
        <AppHeader />
        <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-6 text-lg font-medium">AI is evaluating your solution...</p>
          <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold">{QUESTION.title}</h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {QUESTION.difficulty}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {QUESTION.description}
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Thought Process / Pseudocode
          </h2>
          <textarea
            value={pseudocode}
            disabled={submitted}
            onChange={(e) => setPseudocode(e.target.value)}
            placeholder="Explain how you would solve this problem..."
            rows={10}
            className="mt-3 w-full rounded-md border border-input bg-background p-3 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Code</h2>
            <label className="flex items-center gap-2 text-sm">
              Language
              <select
                value={language}
                disabled={submitted}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            value={code}
            disabled={submitted}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your solution here..."
            rows={16}
            spellCheck={false}
            className="mt-3 w-full rounded-md border border-input bg-foreground/95 p-3 font-mono text-sm leading-relaxed text-background outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
          />
        </section>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          onClick={onSubmit}
          disabled={submitted}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          Submit Solution
        </button>
      </main>
    </div>
  );
}
