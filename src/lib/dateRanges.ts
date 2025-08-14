import { startOfMonth, endOfMonth, subMonths, subDays } from "date-fns";

export type RangeKey =
  | "this_month"
  | "last_30"
  | "last_month"
  | "last_3"
  | "last_6"
  | "last_year";

export function getRange(key: RangeKey) {
  const now = new Date();
  if (key === "this_month")
    return { start: startOfMonth(now), end: endOfMonth(now) };
  if (key === "last_30") return { start: subDays(now, 29), end: now };
  if (key === "last_month") {
    const lastMonthEnd = subMonths(endOfMonth(now), 1);
    const lastMonthStart = startOfMonth(lastMonthEnd);
    return { start: lastMonthStart, end: lastMonthEnd };
  }
  if (key === "last_3") return { start: subMonths(now, 3), end: now };
  if (key === "last_6") return { start: subMonths(now, 6), end: now };
  if (key === "last_year") return { start: subMonths(now, 12), end: now };
  return { start: startOfMonth(now), end: endOfMonth(now) };
}

export const RANGE_OPTIONS: { label: string; value: RangeKey }[] = [
  { label: "This month", value: "this_month" },
  { label: "Last 30 days", value: "last_30" },
  { label: "Last month", value: "last_month" },
  { label: "Last 3 months", value: "last_3" },
  { label: "Last 6 months", value: "last_6" },
  { label: "Last year", value: "last_year" },
];
