export interface CodingEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  registrationLink: string;
}

export const events: CodingEvent[] = [
  { id: 1, title: "AI Hackathon 2026", description: "Build intelligent solutions using cutting-edge AI/ML frameworks. 48-hour sprint with mentorship from industry experts.", date: "2026-04-15T09:00:00", type: "Hackathon", registrationLink: "#" },
  { id: 2, title: "Campus Coding Contest", description: "Compete against the best coders on campus. Three rounds of increasing difficulty. Top 10 win prizes.", date: "2026-04-02T14:00:00", type: "Contest", registrationLink: "#" },
  { id: 3, title: "Web Development Workshop", description: "Hands-on workshop covering React, TypeScript, and modern deployment pipelines.", date: "2026-03-28T10:00:00", type: "Workshop", registrationLink: "#" },
  { id: 4, title: "DSA Bootcamp", description: "Intensive 5-day bootcamp covering arrays, trees, graphs, and dynamic programming. Placement prep focused.", date: "2026-04-10T09:00:00", type: "Bootcamp", registrationLink: "#" },
  { id: 5, title: "Open Source Sprint", description: "Contribute to real open-source projects. Learn git workflows, code review, and collaborative development.", date: "2026-04-20T10:00:00", type: "Sprint", registrationLink: "#" },
  { id: 6, title: "System Design Masterclass", description: "Learn to design scalable systems. Covers load balancing, caching, database sharding, and microservices.", date: "2026-05-01T11:00:00", type: "Workshop", registrationLink: "#" },
  { id: 7, title: "CTF Security Challenge", description: "Capture-the-flag cybersecurity competition. Test your skills in cryptography, reverse engineering, and web exploits.", date: "2026-05-10T09:00:00", type: "Contest", registrationLink: "#" },
  { id: 8, title: "Cloud Computing Workshop", description: "Deploy applications on AWS and GCP. Covers Docker, Kubernetes, and serverless architectures.", date: "2026-05-15T10:00:00", type: "Workshop", registrationLink: "#" },
];
