const firstNames = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Ayaan","Krishna","Ishaan","Shaurya","Atharv","Advik","Pranav","Advaith","Aarush","Kabir","Ritvik","Anirudh","Dhruv","Ananya","Diya","Myra","Sara","Anika","Aadhya","Isha","Riya","Priya","Kavya","Neha","Meera","Tanvi","Shreya","Pooja","Sakshi","Nisha","Divya","Kriti","Sanya","Rohan","Karan","Rahul","Amit","Nikhil","Vikram","Raj","Dev","Harsh","Manish"];
const lastNames = ["Sharma","Verma","Patel","Singh","Kumar","Mehta","Gupta","Joshi","Reddy","Nair","Iyer","Shah","Agarwal","Mishra","Chauhan","Rao","Das","Jain","Pillai","Menon"];
const departments = ["CSE","ECE","IT","ME","EEE","CE","AI/ML","DS"];
const years = ["1st Year","2nd Year","3rd Year","4th Year"];

export interface User {
  id: number;
  name: string;
  department: string;
  year: string;
  problemsSolved: number;
  streak: number;
  rank: number;
  avatar: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const users: User[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  const r = (n: number) => Math.floor(seededRandom(id * 13 + n * 7) * 1000);
  return {
    id,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    department: departments[r(1) % departments.length],
    year: years[r(2) % years.length],
    problemsSolved: 50 + (r(3) % 450),
    streak: 1 + (r(4) % 90),
    rank: 0,
    avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=user${id}`,
  };
}).map((u, _, arr) => {
  const sorted = [...arr].sort((a, b) => b.problemsSolved - a.problemsSolved);
  return { ...u, rank: sorted.findIndex(s => s.id === u.id) + 1 };
});
