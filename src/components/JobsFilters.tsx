"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RANGE_OPTIONS, getRange, RangeKey } from "@/lib/dateRanges";

export type Filters = {
  search: string;
  payment: "all" | "verified" | "unverified";
  jtype: "all" | "hourly" | "fixed";
  country: string;
  hourlyRange: "all" | "5-10" | "10-20" | "20-30" | "30-50" | "50+";
  applied: "all" | "yes" | "no";
  hired: "all" | "me" | "someone_else" | "none";
  closed: "all" | "yes" | "no";
  /** NEW */
  portfolio: "all" | "yes" | "no";
  examples: "all" | "yes" | "no";
  viewed: "all" | "yes" | "no";
  rangeKey: RangeKey;
};

const defaultFilters: Filters = {
  search: "",
  payment: "all",
  jtype: "all",
  country: "",
  hourlyRange: "all",
  applied: "all",
  hired: "all",
  closed: "all",
  /** NEW */
  portfolio: "all",
  examples: "all",
  rangeKey: "this_month",
  viewed: "all",
};

export default function JobsFilters({
  onChange,
}: {
  onChange: (f: Filters, range: { start: Date; end: Date }) => void;
}) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    const range = getRange(filters.rangeKey);
    onChange(filters, range);
  }, [filters, onChange]);

  return (
    <div className="card-gradient-border card-glass shadow-glow p-4 md:p-5 grid gap-3 md:grid-cols-4 lg:grid-cols-8 items-end">
      <div className="md:col-span-2">
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Search title
        </label>
        <Input
          className="field w-full mt-1"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="e.g. Next.js developer"
        />
      </div>

      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Payment
        </label>
        <Select
          value={filters.payment}
          onValueChange={(v) => setFilters({ ...filters, payment: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Type
        </label>
        <Select
          value={filters.jtype}
          onValueChange={(v) => setFilters({ ...filters, jtype: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Hourly range
        </label>
        <Select
          value={filters.hourlyRange}
          onValueChange={(v) =>
            setFilters({ ...filters, hourlyRange: v as any })
          }
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="5-10">$5–10</SelectItem>
            <SelectItem value="10-20">$10–20</SelectItem>
            <SelectItem value="20-30">$20–30</SelectItem>
            <SelectItem value="30-50">$30–50</SelectItem>
            <SelectItem value="50+">$50+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Applied
        </label>
        <Select
          value={filters.applied}
          onValueChange={(v) => setFilters({ ...filters, applied: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Hired
        </label>
        <Select
          value={filters.hired}
          onValueChange={(v) => setFilters({ ...filters, hired: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="me">Me</SelectItem>
            <SelectItem value="someone_else">Someone else</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Closed
        </label>
        <Select
          value={filters.closed}
          onValueChange={(v) => setFilters({ ...filters, closed: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Closed</SelectItem>
            <SelectItem value="no">Open</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Viewed by client
        </label>
        <Select
          value={filters.viewed}
          onValueChange={(v) => setFilters({ ...filters, viewed: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* NEW: Applied with portfolio */}
      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          With portfolio
        </label>
        <Select
          value={filters.portfolio}
          onValueChange={(v) => setFilters({ ...filters, portfolio: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* NEW: Applied with example links */}
      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          With example links
        </label>
        <Select
          value={filters.examples}
          onValueChange={(v) => setFilters({ ...filters, examples: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-[hsl(var(--muted-foreground))]">
          Date range
        </label>
        <Select
          value={filters.rangeKey}
          onValueChange={(v) => setFilters({ ...filters, rangeKey: v as any })}
        >
          <SelectTrigger className="field w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
