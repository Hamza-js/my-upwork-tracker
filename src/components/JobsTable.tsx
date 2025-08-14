"use client";
import { useMemo } from "react";
import { Job } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppliedBadge, HiredBadge } from "./StatusBadges";
import Link from "next/link";
import { PencilLine } from "lucide-react";

export default function JobsTable({ jobs }: { jobs: Job[] }) {
  const rows = useMemo(() => jobs, [jobs]);
  return (
    <div className="card-gradient-border card-glass shadow-glow p-3 md:p-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-[hsl(var(--secondary))/0.35] hover:bg-[hsl(var(--secondary))/0.45]">
            <TableHead className="text-[hsl(var(--muted-foreground))]">
              Title
            </TableHead>
            <TableHead className="text-[hsl(var(--muted-foreground))]">
              Type
            </TableHead>
            <TableHead className="text-[hsl(var(--muted-foreground))]">
              Payment
            </TableHead>
            <TableHead className="text-[hsl(var(--muted-foreground))]">
              Country
            </TableHead>
            <TableHead className="text-[hsl(var(--muted-foreground))]">
              Hourly Range
            </TableHead>
            <TableHead className="text-[hsl(var(--muted-foreground))]">
              Fixed $
            </TableHead>
            <TableHead className="text-[hsl(var(--muted-foreground))]">
              Status
            </TableHead>
            <TableHead className="text-right text-[hsl(var(--muted-foreground))]">
              Edit
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((j) => (
            <TableRow
              key={j.id}
              className="hover:bg-[hsl(var(--secondary))/0.35] transition"
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium leading-tight line-clamp-2">
                    {j.title}
                  </div>
                  {j.job_link && (
                    <a
                      className="inline-flex items-center text-xs underline text-gradient"
                      href={j.job_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open job
                    </a>
                  )}
                </div>
              </TableCell>

              <TableCell className="capitalize">{j.jtype}</TableCell>
              <TableCell className="capitalize">{j.payment}</TableCell>
              <TableCell>{j.country ?? "-"}</TableCell>
              <TableCell>{j.client_hourly_range ?? "-"}</TableCell>
              <TableCell>{j.fixed_amount ?? "-"}</TableCell>

              <TableCell className="space-x-2">
                <AppliedBadge show={j.applied} />
                <HiredBadge
                  me={j.hired}
                  someoneElse={j.close_reason === "someone_else_hired"}
                />
              </TableCell>

              <TableCell className="text-right">
                <Link
                  href={`/jobs/${j.id}/edit`}
                  className="inline-flex items-center gap-1 btn btn-outline h-8 px-3"
                >
                  <PencilLine className="h-4 w-4" />
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
