"use client";
import { useMemo } from "react";
import { Job } from "@/lib/types";
import Link from "next/link";
import { PencilLine } from "lucide-react";
import { AppliedBadge, HiredBadge } from "./StatusBadges";
import { Badge } from "@/components/ui/badge";

export default function JobsTable({ jobs }: { jobs: Job[] }) {
  const rows = useMemo(() => jobs, [jobs]);

  return (
    <div className="space-y-3">
      {rows.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
    </div>
  );
}

/* ---------- Card per job ---------- */
function JobCard({ job: j }: { job: Job }) {
  return (
    <div className="card-gradient-border card-glass shadow-glow p-4 md:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-medium leading-tight text-base md:text-lg line-clamp-2">
            {j.title}
          </h3>
          {j.job_link && (
            <a
              className="inline-flex items-center text-xs underline text-gradient mt-1"
              href={j.job_link}
              target="_blank"
              rel="noreferrer"
            >
              Open job
            </a>
          )}
        </div>

        <Link
          href={`/jobs/${j.id}/edit`}
          className="inline-flex items-center gap-1 btn btn-outline h-9 px-3 shrink-0"
        >
          <PencilLine className="h-4 w-4" />
          Edit
        </Link>
      </div>

      {/* Status pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AppliedBadge show={j.applied} />
        {/* NEW: Viewed pill before Hired */}
        {j.viewed_by_client ? <Badge className="badge">Viewed</Badge> : null}

        {j.invited && <Badge className="badge-brand">Invited</Badge>}
        {j.client_interviewing && <Badge className="badge">Interviewing</Badge>}
        {j.got_reply && <Badge className="badge-success">Replied</Badge>}
        <HiredBadge
          me={j.hired}
          someoneElse={j.close_reason === "someone_else_hired"}
        />
        {j.job_closed && <Badge className="badge-warning">Closed</Badge>}
      </div>

      {/* Details grid */}
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3 lg:grid-cols-4">
        <Info
          label="Type"
          value={<span className="capitalize">{j.jtype}</span>}
        />
        <Info
          label="Payment"
          value={<span className="capitalize">{j.payment}</span>}
        />
        <Info label="Country" value={j.country ?? "-"} />
        <Info label="Hourly Range" value={j.client_hourly_range ?? "-"} />
        <Info
          label="Fixed $"
          value={
            j.fixed_amount != null
              ? `$${Number(j.fixed_amount).toLocaleString()}`
              : "-"
          }
        />
        <Info
          label="# Proposals (when applied)"
          value={j.proposals_at_application ?? "-"}
        />
        <Info label="Connects required" value={j.connects_required ?? "-"} />
        <Info
          label="Applied after (min)"
          value={j.applied_after_minutes ?? "-"}
        />
        <Info
          label="Viewed by client"
          value={j.viewed_by_client ? "Yes" : "No"}
        />
        <Info
          label="Applied with portfolio"
          value={j.applied_with_portfolio ? "Yes" : "No"}
        />
        <Info
          label="Applied with example links"
          value={j.applied_with_examples ? "Yes" : "No"}
        />
        <Info
          label="Close reason"
          value={
            j.close_reason
              ? j.close_reason === "i_hired"
                ? "I am hired"
                : j.close_reason === "someone_else_hired"
                ? "Someone else hired"
                : "Other"
              : "-"
          }
        />
      </div>

      {/* Notes */}
      {j.notes ? (
        <div className="mt-4">
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            Notes
          </div>
          <div className="mt-1 whitespace-pre-wrap">{j.notes}</div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Small info cell ---------- */
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-2.5">
      <div className="text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
        {label}
      </div>
      <div className="mt-0.5 font-medium break-words">{value}</div>
    </div>
  );
}
