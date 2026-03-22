export interface Submission {
  userId: number;
  problemId: number;
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded";
  language: string;
  time: string;
}

const statuses: Submission["status"][] = ["Accepted", "Wrong Answer", "Time Limit Exceeded"];
const languages = ["C++", "Python", "Java", "JavaScript", "Go", "Rust"];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export const submissions: Submission[] = Array.from({ length: 500 }, (_, i) => {
  const r = (n: number) => seededRandom(i * 23 + n * 11);
  const daysAgo = Math.floor(r(5) * 180);
  const date = new Date(2026, 2, 14);
  date.setDate(date.getDate() - daysAgo);
  return {
    userId: 1 + Math.floor(r(1) * 100),
    problemId: 1 + Math.floor(r(2) * 150),
    status: statuses[Math.floor(r(3) * 3)],
    language: languages[Math.floor(r(4) * languages.length)],
    time: date.toISOString(),
  };
});
