"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Job } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const HOURLY_OPTIONS = ["5-10", "10-20", "20-30", "30-50", "50+"];

// Local type augmentation (safe even if you already updated Job in lib/types)
type JobExtra = {
  notes?: string | null;
  applied_with_portfolio?: boolean;
  applied_with_examples?: boolean;
};

export default function JobForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Job> & JobExtra>({
    jtype: "hourly",
    payment: "verified",
    applied: false,
    invited: false,
    client_interviewing: false,
    got_reply: false,
    hired: false,
    job_closed: false,
    /* NEW defaults */
    notes: "",
    applied_with_portfolio: false,
    applied_with_examples: false,
    viewed_by_client: false,
  });

  useEffect(() => {
    async function load() {
      if (!id) return;
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) setForm(data as Job & JobExtra);
    }
    load();
  }, [id]);

  async function save() {
    setLoading(true);
    const payload: any = {
      title: form.title,
      payment: form.payment,
      country: form.country || null,
      client_usd_spent: form.client_usd_spent ?? null,
      jtype: form.jtype,
      client_hourly_range:
        form.jtype === "hourly" ? form.client_hourly_range || null : null,
      fixed_amount: form.jtype === "fixed" ? form.fixed_amount ?? null : null,
      job_link: form.job_link || null,
      proposals_at_application: form.proposals_at_application ?? null,
      connects_required: form.connects_required ?? null,
      applied_after_minutes: form.applied_after_minutes ?? null,
      applied: !!form.applied,
      invited: !!form.invited,
      client_interviewing: !!form.client_interviewing,
      got_reply: !!form.got_reply,
      hired: !!form.hired,
      job_closed: !!form.job_closed,
      close_reason: form.close_reason ?? null,

      /* NEW fields */
      notes: form.notes ?? null,
      applied_with_portfolio: !!form.applied_with_portfolio,
      applied_with_examples: !!form.applied_with_examples,
      viewed_by_client: !!form.viewed_by_client,
    };

    // timeline stamps (unchanged)
    if (payload.applied && !form.applied_at)
      payload.applied_at = new Date().toISOString();
    if (payload.invited && !form.invited_at)
      payload.invited_at = new Date().toISOString();
    if (payload.got_reply && !form.reply_at)
      payload.reply_at = new Date().toISOString();
    if (payload.hired && !form.hired_at)
      payload.hired_at = new Date().toISOString();
    if (payload.job_closed && !form.closed_at)
      payload.closed_at = new Date().toISOString();

    let res;
    if (id) {
      res = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", id)
        .select("id")
        .single();
    } else {
      res = await supabase.from("jobs").insert(payload).select("id").single();
    }

    setLoading(false);
    if (!res.error) router.push("/jobs");
    else alert(res.error.message);
  }

  return (
    <Card className="card-gradient-border card-glass shadow-glow rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Job title
            </label>
            <Input
              className="field w-full mt-1"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Next.js expert for dashboard"
            />
          </div>

          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Payment method
            </label>
            <Select
              value={form.payment || "verified"}
              onValueChange={(v) => setForm({ ...form, payment: v as any })}
            >
              <SelectTrigger className="field w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Country
            </label>
            <Input
              className="field w-full mt-1"
              value={form.country || ""}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="e.g. United States"
            />
          </div>

          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              USD spent
            </label>
            <Input
              className="field w-full mt-1"
              type="number"
              step="1"
              value={form.client_usd_spent ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  client_usd_spent: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Type
            </label>
            <Select
              value={form.jtype || "hourly"}
              onValueChange={(v) => setForm({ ...form, jtype: v as any })}
            >
              <SelectTrigger className="field w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.jtype === "hourly" && (
            <div>
              <label className="text-sm text-[hsl(var(--muted-foreground))]">
                Hourly rate range (client)
              </label>
              <Select
                value={form.client_hourly_range || "10-20"}
                onValueChange={(v) =>
                  setForm({ ...form, client_hourly_range: v })
                }
              >
                <SelectTrigger className="field w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURLY_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      ${o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {form.jtype === "fixed" && (
            <div>
              <label className="text-sm text-[hsl(var(--muted-foreground))]">
                Fixed amount (USD)
              </label>
              <Input
                className="field w-full mt-1"
                type="number"
                step="1"
                value={form.fixed_amount ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fixed_amount: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Job link
            </label>
            <Input
              className="field w-full mt-1"
              value={form.job_link || ""}
              onChange={(e) => setForm({ ...form, job_link: e.target.value })}
              placeholder="https://www.upwork.com/jobs/..."
            />
          </div>

          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              # Proposals (when applied)
            </label>
            <Input
              className="field w-full mt-1"
              type="number"
              value={form.proposals_at_application ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  proposals_at_application: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Connects required
            </label>
            <Input
              className="field w-full mt-1"
              type="number"
              value={form.connects_required ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  connects_required: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Time after which I applied (minutes)
            </label>
            <Input
              className="field w-full mt-1"
              type="number"
              value={form.applied_after_minutes ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  applied_after_minutes: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </div>

          {/* NEW: Notes */}
          <div className="md:col-span-2">
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Notes
            </label>
            <textarea
              className="field w-full mt-1 min-h-[96px]"
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Key details, what you sent, reminders, etc."
            />
          </div>

          {/* Toggles */}
          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="viewed"
              checked={!!form.viewed_by_client}
              onCheckedChange={(v) =>
                setForm({ ...form, viewed_by_client: !!v })
              }
            />
            <label htmlFor="viewed">Viewed by client</label>
          </div>
          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="applied"
              checked={!!form.applied}
              onCheckedChange={(v) => setForm({ ...form, applied: !!v })}
            />
            <label htmlFor="applied">Applied</label>
          </div>

          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="invited"
              checked={!!form.invited}
              onCheckedChange={(v) => setForm({ ...form, invited: !!v })}
            />
            <label htmlFor="invited">Invited</label>
          </div>

          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="interviewing"
              checked={!!form.client_interviewing}
              onCheckedChange={(v) =>
                setForm({ ...form, client_interviewing: !!v })
              }
            />
            <label htmlFor="interviewing">Client started interviewing</label>
          </div>

          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="reply"
              checked={!!form.got_reply}
              onCheckedChange={(v) => setForm({ ...form, got_reply: !!v })}
            />
            <label htmlFor="reply">I got a reply</label>
          </div>

          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="hired"
              checked={!!form.hired}
              onCheckedChange={(v) =>
                setForm({
                  ...form,
                  hired: !!v,
                  close_reason: v ? "i_hired" : form.close_reason,
                })
              }
            />
            <label htmlFor="hired">I got hired</label>
          </div>

          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="closed"
              checked={!!form.job_closed}
              onCheckedChange={(v) => setForm({ ...form, job_closed: !!v })}
            />
            <label htmlFor="closed">Job closed</label>
          </div>

          {/* NEW: Application details */}
          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="with-portfolio"
              checked={!!form.applied_with_portfolio}
              onCheckedChange={(v) =>
                setForm({ ...form, applied_with_portfolio: !!v })
              }
            />
            <label htmlFor="with-portfolio">Applied with portfolio</label>
          </div>

          <div className="field px-3 py-2 flex items-center gap-2 rounded-md">
            <Checkbox
              id="with-examples"
              checked={!!form.applied_with_examples}
              onCheckedChange={(v) =>
                setForm({ ...form, applied_with_examples: !!v })
              }
            />
            <label htmlFor="with-examples">Applied with example links</label>
          </div>

          <div>
            <label className="text-sm text-[hsl(var(--muted-foreground))]">
              Reason of closing
            </label>
            <Select
              value={form.close_reason || "other"}
              onValueChange={(v) =>
                setForm({ ...form, close_reason: v as any })
              }
            >
              <SelectTrigger className="field w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="i_hired">I am hired</SelectItem>
                <SelectItem value="someone_else_hired">
                  Someone else hired
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button onClick={save} disabled={loading} className="btn-gradient">
            {id ? "Update job" : "Create job"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => history.back()}
            disabled={loading}
            className="btn-outline"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
