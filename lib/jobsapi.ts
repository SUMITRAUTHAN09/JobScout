// ============================================================
// lib/jobsApi.ts
// Fetches live jobs from JSearch API (via RapidAPI) — no backend needed
// Get your free key at: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
// Free tier: 200 requests/month
// ============================================================

export interface LiveJob {
  id: string;
  company: string;
  role: string;
  location: string;
  matchPercent: number;
  postedTime: string;
  careerPageUrl: string;
  applyUrl: string;
  skills: string[];
  experience: string;
  type: string;
  logo: string;
  description: string;
  salary: string;
  isRemote: boolean;
}

// -----------------------------------------------------------
// Transform raw JSearch API result → our LiveJob shape
// -----------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformJSearchJob(raw: any, userSkills: string[]): LiveJob {
  const skillsFromDescription = extractSkills(
    raw.job_description || "",
    userSkills
  );

  const matchPercent = calculateMatch(skillsFromDescription, userSkills);

  return {
    id: raw.job_id || Math.random().toString(36).slice(2),
    company: raw.employer_name || "Unknown Company",
    role: raw.job_title || "Software Engineer",
    location: raw.job_is_remote
      ? "Remote"
      : `${raw.job_city || ""}${raw.job_city && raw.job_country ? ", " : ""}${raw.job_country || ""}`.trim() || "Location not specified",
    matchPercent,
    postedTime: formatPostedTime(raw.job_posted_at_timestamp),
    careerPageUrl:
      raw.employer_website ||
      raw.job_apply_link ||
      `https://www.google.com/search?q=${encodeURIComponent(raw.employer_name + " careers")}`,
    applyUrl: raw.job_apply_link || raw.employer_website || "#",
    skills: skillsFromDescription.slice(0, 6),
    experience: raw.job_required_experience?.required_experience_in_months
      ? `${Math.round(raw.job_required_experience.required_experience_in_months / 12)}+ Years`
      : "Not specified",
    type: raw.job_employment_type
      ? raw.job_employment_type.replace("_", " ")
      : "Full-time",
    logo: (raw.employer_name || "?").slice(0, 2).toUpperCase(),
    description: (raw.job_description || "").slice(0, 200) + "...",
    salary:
      raw.job_min_salary && raw.job_max_salary
        ? `$${Math.round(raw.job_min_salary / 1000)}k–$${Math.round(raw.job_max_salary / 1000)}k`
        : raw.job_salary_period
        ? raw.job_salary_period
        : "Not specified",
    isRemote: raw.job_is_remote || false,
  };
}

// -----------------------------------------------------------
// Extract known tech skills from job description text
// -----------------------------------------------------------
const COMMON_SKILLS = [
  "React","Next.js","Vue","Angular","TypeScript","JavaScript","Node.js",
  "Python","Django","FastAPI","Flask","Java","Spring","Kotlin","Swift",
  "Go","Rust","PHP","Laravel","Ruby","Rails","GraphQL","REST","AWS","GCP",
  "Azure","Docker","Kubernetes","PostgreSQL","MongoDB","MySQL","Redis",
  "Tailwind","CSS","HTML","Git","CI/CD","Figma","Agile","Scrum",
  "Express","Nest.js","Prisma","tRPC","Supabase","Firebase",
];

function extractSkills(description: string, userSkills: string[]): string[] {
  const desc = description.toLowerCase();
  const allSkills = [...new Set([...COMMON_SKILLS, ...userSkills])];
  return allSkills.filter((skill) =>
    desc.includes(skill.toLowerCase())
  );
}

// -----------------------------------------------------------
// Calculate match % between job skills and user skills
// -----------------------------------------------------------
function calculateMatch(jobSkills: string[], userSkills: string[]): number {
  if (!userSkills.length) return Math.floor(Math.random() * 20) + 70;
  if (!jobSkills.length) return 60;

  const jobLower = jobSkills.map((s) => s.toLowerCase());
  const userLower = userSkills.map((s) => s.toLowerCase());

  const matched = userLower.filter((us) =>
    jobLower.some((js) => js.includes(us) || us.includes(js))
  );

  const raw = Math.round((matched.length / userLower.length) * 100);
  // Clamp between 55–99
  return Math.min(99, Math.max(55, raw));
}

// -----------------------------------------------------------
// Format Unix timestamp → "2 hours ago", "3 days ago" etc.
// -----------------------------------------------------------
function formatPostedTime(timestamp?: number): string {
  if (!timestamp) return "Recently posted";
  const diffMs = Date.now() - timestamp * 1000;
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return "Just posted";
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? "s" : ""} ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD} day${diffD > 1 ? "s" : ""} ago`;
  return "30+ days ago";
}

// -----------------------------------------------------------
// Main fetch function — call this from your component
// -----------------------------------------------------------
export async function fetchLiveJobs(
  role: string,
  skills: string,
  experience: string,
  apiKey: string
): Promise<LiveJob[]> {
  const skillsList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Build search query — role + top skills
  const query = [role, ...skillsList.slice(0, 2)].filter(Boolean).join(" ") || "Software Engineer";

  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
    query
  )}&num_pages=1&page=1&date_posted=month`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.data || !Array.isArray(data.data)) {
    throw new Error("Unexpected API response format");
  }

  return data.data
    .map((raw: unknown) => transformJSearchJob(raw, skillsList))
    .sort((a: LiveJob, b: LiveJob) => b.matchPercent - a.matchPercent);
}

// -----------------------------------------------------------
// Fallback: The Muse API — completely free, no key needed
// Tech-focused companies, good career page links
// -----------------------------------------------------------
export async function fetchMuseJobs(
  role: string,
  skills: string
): Promise<LiveJob[]> {
  const skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const query = role || skillsList[0] || "engineer";

  const url = `https://www.themuse.com/api/public/jobs?category=Software%20Engineer&level=Mid%20Level&level=Senior%20Level&page=1&descending=true`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Muse API error");

  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results || []).slice(0, 10).map((raw: any) => {
    const skillsFound = extractSkills(
      (raw.contents || "") + " " + (raw.name || ""),
      skillsList
    );
    return {
      id: String(raw.id),
      company: raw.company?.name || "Unknown",
      role: raw.name || "Engineer",
      location: raw.locations?.[0]?.name || "Remote",
      matchPercent: calculateMatch(skillsFound, skillsList),
      postedTime: raw.publication_date
        ? formatPostedTime(new Date(raw.publication_date).getTime() / 1000)
        : "Recently",
      careerPageUrl: raw.company?.refs?.landing_page || raw.refs?.landing_page || "#",
      applyUrl: raw.refs?.landing_page || "#",
      skills: skillsFound.slice(0, 5),
      experience: "Mid–Senior",
      type: "Full-time",
      logo: (raw.company?.name || "??").slice(0, 2).toUpperCase(),
      description: ((raw.contents || "").replace(/<[^>]*>/g, "")).slice(0, 200) + "...",
      salary: "Not specified",
      isRemote: (raw.locations || []).some((l: {name:string}) =>
        l.name.toLowerCase().includes("remote")
      ),
    } as LiveJob;
  }).filter((job: LiveJob) =>
    !role ||
    job.role.toLowerCase().includes(role.toLowerCase()) ||
    job.company.toLowerCase().includes(role.toLowerCase())
  ).sort((a: LiveJob, b: LiveJob) => b.matchPercent - a.matchPercent);
}