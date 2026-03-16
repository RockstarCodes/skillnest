"use client";

import { useEffect, useState } from "react";

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
        console.log("Subjects:", data);
        setSubjects(data);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Subjects</h1>

      {subjects.map((subject) => (
        <div key={subject.id} className="border p-4 rounded mb-4">
          <h2>{subject.title}</h2>
          <p>{subject.description}</p>
        </div>
      ))}
    </div>
  );
}