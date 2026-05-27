// ============================================================
// lib/jobsapi.ts
// Fetches live jobs from JSearch API (via RapidAPI)
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
// Known country/city aliases for soft location matching
// -----------------------------------------------------------
const COUNTRY_ALIASES: Record<string, string[]> = {
  india: ["india", " in,", "bangalore", "bengaluru", "mumbai", "delhi", "hyderabad", "pune", "chennai", "kolkata", "noida", "gurugram", "gurgaon", "ahmedabad", "jaipur", "kochi"],
  usa: ["usa", "united states", "new york", "san francisco", "seattle", "chicago", "austin", "boston", "los angeles", "remote"],
  uk: ["uk", "united kingdom", "england", "london", "manchester", "birmingham"],
  canada: ["canada", "toronto", "vancouver", "montreal"],
  australia: ["australia", "sydney", "melbourne", "brisbane"],
  germany: ["germany", "berlin", "munich", "hamburg"],
  singapore: ["singapore"],
  uae: ["uae", "dubai", "abu dhabi"],
};

function getLocationAliases(location: string): string[] {
  const loc = location.toLowerCase().trim();
  for (const [, aliases] of Object.entries(COUNTRY_ALIASES)) {
    if (aliases.some((a) => loc.includes(a) || a.includes(loc))) {
      return aliases;
    }
  }
  return loc.split(/[\s,]+/).filter((p) => p.length > 2);
}

// -----------------------------------------------------------
// Transform raw JSearch API result → LiveJob
// -----------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformJSearchJob(raw: any, userSkills: string[]): LiveJob {
  const skillsFromDescription = extractSkills(
    (raw.job_description || "") + " " + (raw.job_title || ""),
    userSkills
  );
  const matchPercent = calculateMatch(skillsFromDescription, userSkills);

  const city    = raw.job_city    || "";
  const state   = raw.job_state   || "";
  const country = raw.job_country || "";
  const locationStr = raw.job_is_remote
    ? "Remote"
    : [city, state, country].filter(Boolean).join(", ") || "Location not specified";

  return {
    id:           raw.job_id || Math.random().toString(36).slice(2),
    company:      raw.employer_name  || "Unknown Company",
    role:         raw.job_title      || "Software Engineer",
    location:     locationStr,
    matchPercent,
    postedTime:   formatPostedTime(raw.job_posted_at_timestamp),
    careerPageUrl:
      raw.employer_website ||
      raw.job_apply_link   ||
      `https://www.google.com/search?q=${encodeURIComponent((raw.employer_name || "") + " careers")}`,
    applyUrl: raw.job_apply_link || raw.employer_website || "#",
    skills:   skillsFromDescription.slice(0, 6),
    experience: raw.job_required_experience?.required_experience_in_months
      ? `${Math.round(raw.job_required_experience.required_experience_in_months / 12)}+ Years`
      : "Not specified",
    type:    raw.job_employment_type ? raw.job_employment_type.replace(/_/g, " ") : "Full-time",
    logo:    (raw.employer_name || "?").slice(0, 2).toUpperCase(),
    description: (raw.job_description || "").slice(0, 300) + "...",
    salary:
      raw.job_min_salary && raw.job_max_salary
        ? `$${Math.round(raw.job_min_salary / 1000)}k–$${Math.round(raw.job_max_salary / 1000)}k`
        : "Not specified",
    isRemote: raw.job_is_remote || false,
  };
}

// -----------------------------------------------------------
// Skill extraction
// -----------------------------------------------------------
const COMMON_SKILLS = [
  "React","Next.js","Vue","Angular","TypeScript","JavaScript","Node.js",
  "Python","Django","FastAPI","Flask","Java","Spring","Kotlin","Swift",
  "Go","Rust","PHP","Laravel","Ruby","Rails","GraphQL","REST","AWS",
  "GCP","Azure","Docker","Kubernetes","PostgreSQL","MongoDB","MySQL",
  "Redis","Tailwind","CSS","HTML","Git","CI/CD","Figma","Agile","Scrum",
  "Express","Nest.js","Prisma","tRPC","Supabase","Firebase","C++","C#",
  ".NET","TensorFlow","PyTorch","Pandas","Machine Learning","Data Science",
  "AI","SQL","Flutter","React Native","Terraform",
];

function extractSkills(text: string, userSkills: string[]): string[] {
  const lower = text.toLowerCase();
  return [...new Set([...COMMON_SKILLS, ...userSkills])].filter((s) =>
    lower.includes(s.toLowerCase())
  );
}

// -----------------------------------------------------------
// Match % calculation
// -----------------------------------------------------------
function calculateMatch(jobSkills: string[], userSkills: string[]): number {
  if (!userSkills.length) return Math.floor(Math.random() * 20) + 70;
  if (!jobSkills.length) return 60;
  const jobLower  = jobSkills.map((s) => s.toLowerCase());
  const userLower = userSkills.map((s) => s.toLowerCase());
  const matched   = userLower.filter((us) =>
    jobLower.some((js) => js.includes(us) || us.includes(js))
  );
  return Math.min(99, Math.max(55, Math.round((matched.length / userLower.length) * 100)));
}

// -----------------------------------------------------------
// Time formatter
// -----------------------------------------------------------
function formatPostedTime(timestamp?: number): string {
  if (!timestamp) return "Recently posted";
  const diffH = Math.floor((Date.now() - timestamp * 1000) / 3600000);
  if (diffH < 1)  return "Just posted";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  return "30+ days ago";
}

// -----------------------------------------------------------
// Deduplication
// -----------------------------------------------------------
function deduplicateJobs(jobs: LiveJob[]): LiveJob[] {
  const seen = new Set<string>();
  return jobs.filter((j) => (seen.has(j.id) ? false : (seen.add(j.id), true)));
}

// -----------------------------------------------------------
// Build multiple search queries for maximum coverage
// -----------------------------------------------------------
function buildQueries(role: string, skillsList: string[], location: string): string[] {
  const queries: string[] = [];

  // Most targeted: role + location
  if (role && location) queries.push(`${role} jobs in ${location}`);
  // Role alone (broader)
  if (role)             queries.push(`${role}`);
  // Skill + location
  if (skillsList[0] && location) queries.push(`${skillsList[0]} developer in ${location}`);
  // Skill alone
  if (skillsList[0])    queries.push(`${skillsList[0]} developer`);
  // Absolute fallback
  if (queries.length === 0) queries.push("software engineer");

  return [...new Set(queries)].slice(0, 3);
}

// -----------------------------------------------------------
// Fetch one page
// -----------------------------------------------------------
async function fetchPage(
  query: string,
  page: number,
  location: string,
  apiKey: string
): Promise<unknown[]> {
  const locationParam = location ? `&location=${encodeURIComponent(location)}` : "";
  const url =
    `https://jsearch.p.rapidapi.com/search` +
    `?query=${encodeURIComponent(query)}` +
    `&num_pages=1&page=${page}` +
    `&date_posted=all` +
    locationParam;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit hit. Wait a moment and try again.");
    if (res.status === 403) throw new Error("Invalid API key. Please check your RapidAPI key.");
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data?.data) ? data.data : [];
}

// -----------------------------------------------------------
// Main export
//
// FIXES in this version:
// 1. Builds 3 different queries (role+loc, role, skill) for max coverage
// 2. Fetches pages 1 & 2 for each query in parallel = up to ~60 raw jobs
// 3. date_posted=all instead of "month" — much more results
// 4. SOFT location filter with alias matching + safety net:
//    if filter leaves < 8 jobs, we skip the filter and show everything
//    (better to show 20 unfiltered than 2 filtered)
// -----------------------------------------------------------
export async function fetchLiveJobs(
  role: string,
  skills: string,
  experience: string,
  location: string,
  apiKey: string,
  _maxPages = 3
): Promise<LiveJob[]> {
  const skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const queries    = buildQueries(role, skillsList, location);

  // Fire pages 1 + 2 for every query in parallel
  const tasks: Promise<unknown[]>[] = [];
  for (const q of queries) {
    tasks.push(fetchPage(q, 1, location, apiKey));
    tasks.push(fetchPage(q, 2, location, apiKey));
  }

  const settled = await Promise.allSettled(tasks);

  // If every single request failed, surface a clear error
  if (settled.every((r) => r.status === "rejected")) {
    const reason = (settled[0] as PromiseRejectedResult).reason;
    throw reason instanceof Error
      ? reason
      : new Error("All fetch attempts failed. Check your API key.");
  }

  // Collect raw results from every successful fetch
  const allRaw: unknown[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") allRaw.push(...r.value);
  }

  if (allRaw.length === 0) {
    throw new Error(
      "No jobs found. Try a broader search term or clear the location filter."
    );
  }

  // Transform + deduplicate
  let jobs = deduplicateJobs(
    allRaw.map((raw) => transformJSearchJob(raw, skillsList))
  );

  // ---------------------------------------------------------
  // SOFT location filter
  // Only applied when user gave a location.
  // A job PASSES if:
  //   - it is marked Remote, OR
  //   - its location string contains any alias for the target country/city, OR
  //   - its location is "Location not specified" (don't discard unknowns)
  //
  // SAFETY NET: if fewer than 8 jobs survive filtering, skip the filter
  // entirely so the user always sees a useful number of results.
  // ---------------------------------------------------------
  if (location.trim()) {
    const aliases = getLocationAliases(location);

    const filtered = jobs.filter((j) => {
      if (j.isRemote) return true;
      if (j.location === "Location not specified") return true;
      const loc = j.location.toLowerCase();
      return aliases.some((a) => loc.includes(a));
    });

    // Only apply filter if it leaves a reasonable number of results
    jobs = filtered.length >= 8 ? filtered : jobs;
  }

  return jobs.sort((a, b) => b.matchPercent - a.matchPercent);
}

// -----------------------------------------------------------
// Fallback: The Muse API — free, no key needed
// -----------------------------------------------------------
export async function fetchMuseJobs(role: string, skills: string): Promise<LiveJob[]> {
  const skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const url = `https://www.themuse.com/api/public/jobs?category=Software%20Engineer&level=Mid%20Level&level=Senior%20Level&page=1&descending=true`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Muse API error");
  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.results || []).slice(0, 10).map((raw: any) => {
    const skillsFound = extractSkills((raw.contents || "") + " " + (raw.name || ""), skillsList);
    return {
      id:           String(raw.id),
      company:      raw.company?.name || "Unknown",
      role:         raw.name || "Engineer",
      location:     raw.locations?.[0]?.name || "Remote",
      matchPercent: calculateMatch(skillsFound, skillsList),
      postedTime:   raw.publication_date ? formatPostedTime(new Date(raw.publication_date).getTime() / 1000) : "Recently",
      careerPageUrl: raw.company?.refs?.landing_page || raw.refs?.landing_page || "#",
      applyUrl:     raw.refs?.landing_page || "#",
      skills:       skillsFound.slice(0, 5),
      experience:   "Mid–Senior",
      type:         "Full-time",
      logo:         (raw.company?.name || "??").slice(0, 2).toUpperCase(),
      description:  (raw.contents || "").replace(/<[^>]*>/g, "").slice(0, 200) + "...",
      salary:       "Not specified",
      isRemote:     (raw.locations || []).some((l: { name: string }) => l.name.toLowerCase().includes("remote")),
    } as LiveJob;
  })
  .filter((job: LiveJob) => !role || job.role.toLowerCase().includes(role.toLowerCase()))
  .sort((a: LiveJob, b: LiveJob) => b.matchPercent - a.matchPercent);
}