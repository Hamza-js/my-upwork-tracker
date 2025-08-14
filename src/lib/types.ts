export type Payment = "verified" | "unverified";
export type JobType = "hourly" | "fixed";
export type CloseReason = "i_hired" | "someone_else_hired" | "other" | null;

export interface Job {
  id: string;
  created_at: string;
  updated_at: string;

  title: string;
  payment: Payment;
  country: string | null;
  client_usd_spent: number | null;

  jtype: JobType;
  client_hourly_range: string | null; // e.g. '10-20', '50+'
  fixed_amount: number | null;

  job_link: string | null;

  proposals_at_application: number | null;
  connects_required: number | null;
  applied_after_minutes: number | null;

  applied: boolean;
  applied_at: string | null;

  invited: boolean;
  invited_at: string | null;

  client_interviewing: boolean;
  got_reply: boolean;
  reply_at: string | null;

  hired: boolean; // you got hired
  hired_at: string | null;

  job_closed: boolean;
  close_reason: CloseReason;
  closed_at: string | null;

  auto_close_at: string;
}

export interface DailyInsight {
  day: string; // ISO date
  jobs_saved: number;
  jobs_applied: number;
  jobs_interviewing: number;
  jobs_got_reply: number;
  jobs_hired_me: number;
  jobs_closed: number;
}
