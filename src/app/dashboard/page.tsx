"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getRange, RANGE_OPTIONS, RangeKey } from "@/lib/dateRanges";
import StatCard from "@/components/StatCard";
import InsightsCharts from "@/components/InsightsCharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const [key, setKey] = useState<RangeKey>("this_month");
  const range = useMemo(() => getRange(key), [key]);
  const [stats, setStats] = useState({
    saved: 0,
    applied: 0,
    interviewing: 0,
    reply: 0,
    hired: 0,
    closed: 0,
  });

  useEffect(() => {
    async function load() {
      const { start, end } = range;
      const s = start.toISOString();
      const e = end.toISOString();
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "applied, client_interviewing, got_reply, hired, job_closed, created_at"
        )
        .gte("created_at", s)
        .lte("created_at", e);
      if (!error && data) {
        const saved = data.length;
        const applied = data.filter((x) => x.applied).length;
        const interviewing = data.filter((x) => x.client_interviewing).length;
        const reply = data.filter((x) => x.got_reply).length;
        const hired = data.filter((x) => x.hired).length;
        const closed = data.filter((x) => x.job_closed).length;
        setStats({ saved, applied, interviewing, reply, hired, closed });
      }
    }
    load();
  }, [range.start, range.end, range]);

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="card-gradient-border card-glass p-4 md:p-5 shadow-glow flex items-center justify-between">
        <h2 className="text-gradient text-xl md:text-2xl font-semibold tracking-tight">
          Dashboard
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-[hsl(var(--muted-foreground))]">
            Date
          </span>
          <Select value={key} onValueChange={(v) => setKey(v as RangeKey)}>
            <SelectTrigger className="field h-9 w-[220px]">
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Jobs Saved" value={stats.saved} />
        <StatCard label="I Applied" value={stats.applied} />
        <StatCard label="Client Interviewing" value={stats.interviewing} />
        <StatCard label="I Got Reply" value={stats.reply} />
        <StatCard label="I Got Hired" value={stats.hired} />
        <StatCard label="Jobs Closed" value={stats.closed} />
      </div>

      {/* Charts (component keeps its own layout; wrapper gives spacing consistency) */}
      <div className="space-y-4">
        <InsightsCharts start={range.start} end={range.end} />
      </div>
    </div>
  );
}
