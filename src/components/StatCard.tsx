"use client";
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card className="card-gradient-border card-glass shadow-glow rounded-2xl group">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-start justify-between">
          <div className="text-xs md:text-sm text-[hsl(var(--muted-foreground))]">
            {label}
          </div>
          {/* <span className="h-1 w-10 rounded-full bg-[linear-gradient(90deg,hsl(var(--brand-1)),hsl(var(--brand-4)))] opacity-80 transition-all group-hover:w-14" /> */}
        </div>

        <div className="mt-2 text-3xl font-semibold tracking-tight">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
