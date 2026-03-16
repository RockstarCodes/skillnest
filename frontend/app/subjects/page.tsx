"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Subject = {
  id: number;
  title: string;
  slug: string;
  description: string;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch("https://skillnest-api.onrender.com/api/subjects")
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-semibold mb-6">Subjects</h1>

      <div className="grid gap-4">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/subjects/${subject.id}`}
            className="border rounded-lg p-5 hover:bg-gray-50 transition"
          >
            <h2 className="font-medium text-lg">{subject.title}</h2>
            <p className="text-sm text-gray-500">
              {subject.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}