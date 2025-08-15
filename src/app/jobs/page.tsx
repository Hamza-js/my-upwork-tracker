"use client";
import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import JobsFilters, { Filters } from "@/components/JobsFilters";
import JobsTable from "@/components/JobsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Job } from "@/lib/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const refetch = useCallback(
    async (f: Filters, r: { start: Date; end: Date }) => {
      const q = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .gte("created_at", r.start.toISOString())
        .lte("created_at", r.end.toISOString());

      if (f.search) q.ilike("title", `%${f.search}%`);
      if (f.payment !== "all") q.eq("payment", f.payment);
      if (f.jtype !== "all") q.eq("jtype", f.jtype);
      if (f.hourlyRange !== "all") q.eq("client_hourly_range", f.hourlyRange);

      if (f.applied === "yes") q.eq("applied", true);
      else if (f.applied === "no") q.eq("applied", false);

      if (f.closed === "yes") q.eq("job_closed", true);
      else if (f.closed === "no") q.eq("job_closed", false);

      if (f.hired === "me") q.eq("hired", true);
      else if (f.hired === "someone_else")
        q.eq("close_reason", "someone_else_hired");
      else if (f.hired === "none") q.or("hired.eq.false,close_reason.is.null");

      if (f.country) q.ilike("country", `%${f.country}%`);

      // NEW filters
      if (f.portfolio === "yes") q.eq("applied_with_portfolio", true);
      else if (f.portfolio === "no") q.eq("applied_with_portfolio", false);

      if (f.examples === "yes") q.eq("applied_with_examples", true);
      else if (f.examples === "no") q.eq("applied_with_examples", false);

      if (f.viewed === "yes") q.eq("viewed_by_client", true);
      else if (f.viewed === "no") q.eq("viewed_by_client", false);

      const { data, error } = await q;
      if (!error && data) setJobs(data as Job[]);
    },
    []
  );

  // --- Derived stats from *filtered* jobs ---
  const { appliedCount, totalConnects, totalUsd } = useMemo(() => {
    const applied = jobs.filter((j) => j.applied);
    const connects = applied.reduce(
      (sum, j) => sum + (j.connects_required ?? 0),
      0
    );
    const usd = Number((connects * 0.15).toFixed(2)); // 10 connects = $1.50 → $0.15 per connect
    return {
      appliedCount: applied.length,
      totalConnects: connects,
      totalUsd: usd,
    };
  }, [jobs]);

  const usdFmt = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    []
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-gradient text-xl md:text-2xl font-semibold tracking-tight">
          Jobs
        </h2>
        <Button asChild className="btn-gradient h-9 px-4">
          <Link href="/jobs/new">Add new</Link>
        </Button>
      </div>

      {/* Filters */}
      <JobsFilters onChange={refetch} />

      {/* Stats from filtered results */}
      <div className="card-gradient-border card-glass shadow-glow p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              Applied jobs
            </div>
            <div className="mt-1 text-2xl font-semibold">{appliedCount}</div>
          </div>
          <div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              Total connects
            </div>
            <div className="mt-1 text-2xl font-semibold">{totalConnects}</div>
          </div>
          <div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              Total USD spent
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {usdFmt.format(totalUsd)}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <JobsTable jobs={jobs} />
    </div>
  );
}
