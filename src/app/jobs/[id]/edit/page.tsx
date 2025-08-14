"use client";
import { useParams } from "next/navigation";
import JobForm from "@/components/JobForm";

export default function EditJobPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="space-y-4">
      <div className="card-gradient-border card-glass shadow-glow p-4 md:p-5">
        <h2 className="text-gradient text-xl md:text-2xl font-semibold tracking-tight">
          Edit Job
        </h2>
      </div>

      <JobForm id={id} />
    </div>
  );
}
