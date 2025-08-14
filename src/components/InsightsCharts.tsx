"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DailyInsight } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function InsightsCharts({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) {
  const [data, setData] = useState<DailyInsight[]>([]);

  useEffect(() => {
    async function load() {
      // easiest: query the view and filter client-side
      const { data, error } = await supabase
        .from("job_insights_daily")
        .select("*")
        .order("day", { ascending: true });
      if (!error && data) {
        const s = start.toISOString().slice(0, 10);
        const e = end.toISOString().slice(0, 10);
        const filtered = (data as DailyInsight[]).filter(
          (d) => d.day >= s && d.day <= e
        );
        setData(filtered);
      }
    }
    load();
  }, [start, end]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Activity over time */}
      <Card className="card-gradient-border card-glass shadow-glow">
        <CardContent className="p-4 h-[360px]">
          <div className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
            Activity over time
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="lineSaved" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={`hsl(var(--brand-1))`} />
                  <stop offset="100%" stopColor={`hsl(var(--brand-2))`} />
                </linearGradient>
                <linearGradient id="lineApplied" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={`hsl(var(--brand-2))`} />
                  <stop offset="100%" stopColor={`hsl(var(--brand-3))`} />
                </linearGradient>
                <linearGradient id="lineHired" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={`hsl(var(--brand-3))`} />
                  <stop offset="100%" stopColor={`hsl(var(--brand-4))`} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Legend
                wrapperStyle={{ color: "hsl(var(--muted-foreground))" }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="jobs_saved"
                name="Saved"
                dot={false}
                stroke="url(#lineSaved)"
                strokeWidth={2.2}
              />
              <Line
                type="monotone"
                dataKey="jobs_applied"
                name="Applied"
                dot={false}
                stroke="url(#lineApplied)"
                strokeWidth={2.2}
              />
              <Line
                type="monotone"
                dataKey="jobs_hired_me"
                name="Hired"
                dot={false}
                stroke="url(#lineHired)"
                strokeWidth={2.2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pipeline breakdown */}
      <Card className="card-gradient-border card-glass shadow-glow">
        <CardContent className="p-4 h-[360px]">
          <div className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
            Pipeline breakdown
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={[
                {
                  label: "Totals",
                  saved: sum(data, "jobs_saved"),
                  applied: sum(data, "jobs_applied"),
                  interviewing: sum(data, "jobs_interviewing"),
                  reply: sum(data, "jobs_got_reply"),
                  hired: sum(data, "jobs_hired_me"),
                  closed: sum(data, "jobs_closed"),
                },
              ]}
              margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
            >
              {/* Gradients for bars */}
              <defs>
                <linearGradient id="barSaved" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={`hsl(var(--brand-1))`} />
                  <stop offset="100%" stopColor={`hsl(var(--brand-2))`} />
                </linearGradient>
                <linearGradient id="barApplied" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={`hsl(var(--brand-2))`} />
                  <stop offset="100%" stopColor={`hsl(var(--brand-3))`} />
                </linearGradient>
                <linearGradient id="barOther" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={`hsl(var(--brand-3))`} />
                  <stop offset="100%" stopColor={`hsl(var(--brand-4))`} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Legend
                wrapperStyle={{ color: "hsl(var(--muted-foreground))" }}
                iconType="circle"
              />
              <Bar
                dataKey="saved"
                name="Saved"
                fill="url(#barSaved)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="applied"
                name="Applied"
                fill="url(#barApplied)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="interviewing"
                name="Interviewing"
                fill="url(#barOther)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="reply"
                name="Got Reply"
                fill="url(#barOther)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="hired"
                name="Hired"
                fill="url(#barOther)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="closed"
                name="Closed"
                fill="url(#barOther)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function sum<T>(arr: T[], key: keyof T & string): number {
  return arr.reduce((a: number, x: any) => a + (x?.[key] ?? 0), 0);
}
