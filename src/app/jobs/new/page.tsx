import JobForm from "@/components/JobForm";

export default function NewJobPage() {
  return (
    <div className="space-y-4">
      <div className="card-gradient-border card-glass shadow-glow p-4 md:p-5">
        <h2 className="text-gradient text-xl md:text-2xl font-semibold tracking-tight">
          Add New Job
        </h2>
      </div>

      <JobForm />
    </div>
  );
}
