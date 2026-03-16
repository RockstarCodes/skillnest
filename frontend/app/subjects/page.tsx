"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

type Subject = {
  id: number;
  title: string;
  description: string | null;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiClient
      .get("/subjects")
      .then((res) => {
        if (!mounted) return;
        setSubjects(res.data?.subjects ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load subjects");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="py-10">
      <h1 className="text-xl font-semibold tracking-tight">Subjects</h1>
      <p className="mt-1 text-sm text-slate-600">Pick a subject and continue where you left off.</p>

      {loading ? <div className="mt-6 text-sm text-slate-500">Loading…</div> : null}
      {error ? <div className="mt-6 text-sm text-red-600">{error}</div> : null}

      <div className="mt-6 grid gap-3">
        {subjects.map((s) => (
          <a
            key={s.id}
            href={`/subjects/${s.id}`}
            className="rounded-lg border border-slate-200 p-4 hover:border-slate-300"
          >
            <div className="font-medium">{s.title}</div>
            {s.description ? <div className="mt-1 text-sm text-slate-600">{s.description}</div> : null}
          </a>
        ))}
      </div>
    </div>
  );
}

