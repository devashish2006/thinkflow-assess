export const TEST_INFO = {
  name: "Maventic DSA Screening Test",
  college: "Oriental Institute of Science and Technology",
  duration: "60 Minutes",
  questions: 1,
  passingScore: 70,
};

export const QUESTION = {
  title: "Two Sum",
  description:
    "Given an array of integers and a target integer, find two numbers whose sum equals the target. Return their indices.",
  expectedApproach: "HashMap",
  difficulty: "Easy",
};

export const LANGUAGES = ["JavaScript", "Python", "Java", "C++", "C"] as const;

export type Session = { role: "admin" | "student"; email: string; name: string };

const KEY = "maventic-session";

export function login(email: string, password: string): Session | null {
  const e = email.trim().toLowerCase();
  if (e === "admin@maventic.com" && password === "admin123")
    return { role: "admin", email: e, name: "Admin" };
  if (e === "student@maventic.com" && password === "student123")
    return { role: "student", email: e, name: "Demo Student" };
  return null;
}

export function saveSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export const CRITERIA = [
  { key: "understanding_score", label: "Understanding", max: 20 },
  { key: "approach_score", label: "Approach", max: 20 },
  { key: "pseudocode_score", label: "Pseudocode", max: 20 },
  { key: "logic_score", label: "Code Logic", max: 20 },
  { key: "correctness_score", label: "Correctness", max: 10 },
  { key: "complexity_score", label: "Complexity", max: 5 },
  { key: "edge_case_score", label: "Edge Cases", max: 5 },
] as const;

export type Submission = {
  id: string;
  student_name: string;
  question: string;
  pseudocode: string;
  code: string;
  language: string;
  understanding_score: number;
  approach_score: number;
  pseudocode_score: number;
  logic_score: number;
  correctness_score: number;
  complexity_score: number;
  edge_case_score: number;
  total_score: number;
  recommendation: string;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  created_at: string;
};
