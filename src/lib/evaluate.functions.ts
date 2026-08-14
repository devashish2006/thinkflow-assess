import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  studentName: z.string().min(1),
  question: z.string().min(1),
  expectedApproach: z.string().min(1),
  pseudocode: z.string(),
  code: z.string(),
  language: z.string().min(1),
});

const clamp = (v: unknown, max: number) => {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
};

export const evaluateSubmission = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured on the server.");

    const prompt = `You are a senior technical interviewer evaluating a candidate's DSA screening submission.

QUESTION: ${data.question}
EXPECTED APPROACH: ${data.expectedApproach}
PROGRAMMING LANGUAGE: ${data.language}

STUDENT PSEUDOCODE / THOUGHT PROCESS:
${data.pseudocode || "(empty)"}

STUDENT CODE:
${data.code || "(empty)"}

Evaluate reasoning first, not compilation. Minor syntax errors, missing semicolons, typos or incomplete syntax must NOT heavily reduce the score when the algorithm and reasoning are correct. Wrong algorithms, incorrect reasoning and fundamental logical errors MUST significantly reduce the score. Empty or irrelevant submissions get near-zero scores.

Score using these maximums:
understanding (20), approach (20), pseudocode (20), logic (20), correctness (10), complexity (5), edge_cases (5).

Return ONLY valid JSON, no markdown fences, in exactly this shape:
{"understanding":0,"approach":0,"pseudocode":0,"logic":0,"correctness":0,"complexity":0,"edge_cases":0,"total":0,"recommendation":"SHORTLISTED","feedback":"","strengths":[""],"weaknesses":[""]}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a strict but fair technical evaluator. You always respond with a single JSON object.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Groq error", res.status, text);
      throw new Error(`AI evaluation failed (${res.status})`);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content ?? "";
    let parsed: Record<string, unknown>;
    try {
      const cleaned = content.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned) as Record<string, unknown>;
    } catch {
      console.error("Unparseable AI response", content);
      throw new Error("AI returned an invalid response. Please try again.");
    }

    const scores = {
      understanding_score: clamp(parsed["understanding"], 20),
      approach_score: clamp(parsed["approach"], 20),
      pseudocode_score: clamp(parsed["pseudocode"], 20),
      logic_score: clamp(parsed["logic"], 20),
      correctness_score: clamp(parsed["correctness"], 10),
      complexity_score: clamp(parsed["complexity"], 5),
      edge_case_score: clamp(parsed["edge_cases"], 5),
    };

    // Total is recomputed from the criteria, never trusted from the model.
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const recommendation = total >= 70 ? "SHORTLISTED" : "NOT SHORTLISTED";

    const asStrings = (v: unknown) =>
      Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean).slice(0, 6) : [];

    const row = {
      student_name: data.studentName,
      question: data.question,
      pseudocode: data.pseudocode,
      code: data.code,
      language: data.language,
      ...scores,
      total_score: total,
      recommendation,
      feedback: typeof parsed["feedback"] === "string" ? parsed["feedback"] : "",
      strengths: asStrings(parsed["strengths"]),
      weaknesses: asStrings(parsed["weaknesses"]),
    };

    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data: inserted, error } = await supabase
      .from("submissions")
      .insert(row)
      .select("id")
      .single();
    if (error) {
      console.error("Insert failed", error);
      throw new Error("Could not save your submission.");
    }

    return { id: inserted.id as string, ...row };
  });
