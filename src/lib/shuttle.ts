import { cacheLife } from "next/cache";

// The hero's run strip is real: it counts shuttle-poll's latest unbroken run of
// on-time, successful GitHub Actions runs from the public API, refreshed daily.

export type Streak = { count: number; since: string; until: string; live: boolean };

// Last verified by hand on 2026-10-23 (research/shuttle-poll.md). Used only if the API is unreachable.
const FALLBACK: Streak = { count: 21, since: "2026-10-03", until: "2026-10-23", live: false };

// cron-job.org fires at 12:00 UTC (17:30 IST); a run that starts later than this is not "on time".
const ON_TIME_SECONDS = 180;

type Run = { conclusion: string | null; status: string; event: string; run_started_at: string };

export async function getStreak(): Promise<Streak> {
  "use cache";
  cacheLife("days");
  try {
    const res = await fetch(
      "https://api.github.com/repos/sivraamkrishnankv/shuttle-poll/actions/runs?per_page=100",
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const { workflow_runs } = (await res.json()) as { workflow_runs: Run[] };
    const runs = workflow_runs
      .filter((r) => r.status === "completed" && r.event === "workflow_dispatch")
      .sort((a, b) => b.run_started_at.localeCompare(a.run_started_at));

    const streak: Run[] = [];
    for (const r of runs) {
      const t = new Date(r.run_started_at);
      const sinceNoon = (t.getTime() - Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), 12)) / 1000;
      if (r.conclusion !== "success" || sinceNoon < 0 || sinceNoon > ON_TIME_SECONDS) break;
      streak.push(r);
    }
    if (streak.length === 0) throw new Error("no on-time runs found");
    return {
      count: streak.length,
      since: streak[streak.length - 1].run_started_at.slice(0, 10),
      until: streak[0].run_started_at.slice(0, 10),
      live: true,
    };
  } catch (err) {
    console.warn(`[shuttle-poll streak] using the hand-checked fallback: ${(err as Error).message}`);
    return FALLBACK;
  }
}

export function formatDay(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}
