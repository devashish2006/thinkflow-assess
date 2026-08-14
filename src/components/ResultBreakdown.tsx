import { CRITERIA, type Submission } from "@/lib/assess";

export function ResultBreakdown({ s }: { s: Submission }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Score Breakdown
        </h3>
        <ul className="mt-4 divide-y divide-border">
          {CRITERIA.map((c) => (
            <li key={c.key} className="flex items-center justify-between py-2 text-sm">
              <span>{c.label}</span>
              <span className="font-medium">
                {s[c.key]} / {c.max}
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between py-3 text-sm font-bold">
            <span>Total</span>
            <span>{s.total_score} / 100</span>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          AI Feedback
        </h3>
        <p className="mt-3 text-sm leading-relaxed">{s.feedback || "—"}</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold">Strengths</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {s.strengths.length ? s.strengths.map((x, i) => <li key={i}>{x}</li>) : <li>—</li>}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Weaknesses</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {s.weaknesses.length ? s.weaknesses.map((x, i) => <li key={i}>{x}</li>) : <li>—</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
