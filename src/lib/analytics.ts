/** Shared time-window helpers used by both recording and reporting. */

/** ISO calendar day (YYYY-MM-DD) used as the ActivityEvent partition key. */
export function isoDay(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** The last `days` ISO day keys, most recent first. */
export function recentDays(days: number, from: Date = new Date()): string[] {
  return Array.from({ length: days }, (_, offset) => {
    const day = new Date(from);
    day.setUTCDate(day.getUTCDate() - offset);
    return isoDay(day);
  });
}

/** Start of the trailing 7-day window, as an ISO timestamp. */
export function weekAgo(from: Date = new Date()): string {
  const start = new Date(from);
  start.setUTCDate(start.getUTCDate() - 7);
  return start.toISOString();
}

export function isOverdue(dueAt: string | null | undefined, status: string): boolean {
  if (!dueAt) return false;
  if (status === "COMPLETED") return false;
  return new Date(dueAt).getTime() < Date.now();
}

export function percent(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}
