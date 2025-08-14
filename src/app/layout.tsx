import "./globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Upwork Jobs Tracker",
  description: "Track and analyze Upwork applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("app-bg bg-grid")}>
        <div className="mx-auto max-w-6xl p-6">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-gradient text-2xl md:text-3xl font-semibold tracking-tight">
              Upwork Jobs Tracker
            </h1>

            <nav className="flex items-center gap-2 text-sm">
              <a href="/dashboard" className="btn btn-outline h-9 px-3">
                Dashboard
              </a>
              <a href="/jobs" className="btn btn-gradient h-9 px-3">
                Jobs
              </a>
            </nav>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
