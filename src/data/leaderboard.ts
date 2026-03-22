import { users } from "./users";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  problemsSolved: number;
  streak: number;
  avatar: string;
  department: string;
}

export const leaderboard: LeaderboardEntry[] = [...users]
  .sort((a, b) => b.problemsSolved - a.problemsSolved)
  .slice(0, 50)
  .map((u, i) => ({
    rank: i + 1,
    name: u.name,
    problemsSolved: u.problemsSolved,
    streak: u.streak,
    avatar: u.avatar,
    department: u.department,
  }));
