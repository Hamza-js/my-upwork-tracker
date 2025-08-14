"use client";
import { Badge } from "@/components/ui/badge";

export function AppliedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  // Gradient brand badge
  return <Badge className="badge badge-brand">Applied</Badge>;
}

export function HiredBadge({
  me,
  someoneElse,
}: {
  me: boolean;
  someoneElse: boolean;
}) {
  if (!me && !someoneElse) return null;
  if (me) {
    // Success (green) badge
    return <Badge className="badge badge-success">Hired</Badge>;
  }
  if (someoneElse) {
    // Warning (amber) badge
    return <Badge className="badge badge-warning">Hired</Badge>;
  }
  return null;
}
