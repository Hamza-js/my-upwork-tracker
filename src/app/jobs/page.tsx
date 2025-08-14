"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import JobsFilters, { Filters } from "@/components/JobsFilters";
import JobsTable from "@/components/JobsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [range, setRange] = useState<{ start: Date; end: Date }>();
  const [filters, setFilters] = useState<Filters | null>(null);

  const refetch = useCallback(
    async (f: Filters, r: { start: Date; end: Date }) => {
      setFilters(f);
      setRange(r);
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

      const { data, error } = await q;
      if (!error && data) setJobs(data);
    },
    []
  );

  useEffect(() => {
    /* initial load handled by JobsFilters useEffect */
  }, []);

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

      {/* Filters (already glossy inside component) */}
      <JobsFilters onChange={refetch} />

      {/* Table (already glossy inside component) */}
      <JobsTable jobs={jobs} />
    </div>
  );
}
