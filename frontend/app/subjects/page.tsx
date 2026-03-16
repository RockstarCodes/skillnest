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
    console.log("Component mounted");

    fetch("https://skillnest-api.onrender.com/api/subjects")
      .then((res) => res.json())
      .then((data) => {
        console.log("Subjects received:", data);
        setSubjects(data);
      });
  }, []);

  return (
    <div>
      <h1>Subjects</h1>

      {subjects.map((subject) => (
        <div key={subject.id}>
          <h2>{subject.title}</h2>
          <p>{subject.description}</p>
        </div>
      ))}
    </div>
  );
}