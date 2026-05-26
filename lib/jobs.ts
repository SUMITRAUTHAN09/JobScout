export interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  matchPercent: number;
  postedTime: string;
  careerPageUrl: string;
  skills: string[];
  experience: string;
  type: string;
  logo: string;
}

export const mockJobs: Job[] = [
  {
    id: "1",
    company: "Vercel",
    role: "Senior Frontend Engineer",
    location: "Remote (Global)",
    matchPercent: 97,
    postedTime: "2 hours ago",
    careerPageUrl: "https://vercel.com/careers",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    experience: "3-5 Years",
    type: "Full-time",
    logo: "V",
  },
  {
    id: "2",
    company: "Linear",
    role: "Frontend Developer",
    location: "San Francisco, CA / Remote",
    matchPercent: 93,
    postedTime: "5 hours ago",
    careerPageUrl: "https://linear.app/careers",
    skills: ["React", "TypeScript", "GraphQL", "CSS"],
    experience: "2-4 Years",
    type: "Full-time",
    logo: "L",
  },
  {
    id: "3",
    company: "Anthropic",
    role: "Full Stack Engineer",
    location: "San Francisco, CA",
    matchPercent: 89,
    postedTime: "1 day ago",
    careerPageUrl: "https://www.anthropic.com/careers",
    skills: ["Python", "React", "TypeScript", "AWS"],
    experience: "3+ Years",
    type: "Full-time",
    logo: "A",
  },
  {
    id: "4",
    company: "Notion",
    role: "React Engineer",
    location: "Remote (US)",
    matchPercent: 85,
    postedTime: "1 day ago",
    careerPageUrl: "https://www.notion.so/careers",
    skills: ["React", "TypeScript", "Node.js"],
    experience: "2-5 Years",
    type: "Full-time",
    logo: "N",
  },
  {
    id: "5",
    company: "Figma",
    role: "Software Engineer, Frontend",
    location: "New York / Remote",
    matchPercent: 82,
    postedTime: "2 days ago",
    careerPageUrl: "https://www.figma.com/careers",
    skills: ["TypeScript", "React", "WebGL", "CSS"],
    experience: "2-4 Years",
    type: "Full-time",
    logo: "F",
  },
  {
    id: "6",
    company: "Resend",
    role: "Frontend Engineer",
    location: "Remote (Global)",
    matchPercent: 91,
    postedTime: "3 hours ago",
    careerPageUrl: "https://resend.com/careers",
    skills: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    experience: "1-3 Years",
    type: "Full-time",
    logo: "R",
  },
  {
    id: "7",
    company: "Loom",
    role: "UI Engineer",
    location: "Remote",
    matchPercent: 78,
    postedTime: "3 days ago",
    careerPageUrl: "https://www.loom.com/careers",
    skills: ["React", "CSS", "TypeScript", "Animation"],
    experience: "2+ Years",
    type: "Full-time",
    logo: "LO",
  },
  {
    id: "8",
    company: "Clerk",
    role: "Developer Experience Engineer",
    location: "Remote (Global)",
    matchPercent: 88,
    postedTime: "6 hours ago",
    careerPageUrl: "https://clerk.com/careers",
    skills: ["React", "Next.js", "Node.js", "TypeScript"],
    experience: "2-4 Years",
    type: "Full-time",
    logo: "C",
  },
];

export function filterJobs(
  jobs: Job[],
  role: string,
  skills: string,
  experience: string
): Job[] {
  const roleQuery = role.toLowerCase();
  const skillsArray: string[] = skills
    .split(",")
    .map((s: string) => s.trim().toLowerCase())
    .filter(Boolean);

  return jobs
    .filter((job: Job) => {
      const roleMatch =
        !role ||
        job.role.toLowerCase().includes(roleQuery) ||
        job.company.toLowerCase().includes(roleQuery);

      const skillMatch =
        skillsArray.length === 0 ||
        skillsArray.some((sk: string) =>
          job.skills.some((js: string) => js.toLowerCase().includes(sk))
        );

      return roleMatch && skillMatch;
    })
    .sort((a: Job, b: Job) => b.matchPercent - a.matchPercent);
}