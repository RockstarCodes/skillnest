import { dbPool } from "../config/db";

type SeedVideo = {
  title: string;
  youtube_url: string;
  description?: string | null;
  duration_seconds?: number | null;
};

type SeedSection = {
  title: string;
  videos: SeedVideo[];
};

type SeedSubject = {
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
  sections: SeedSection[];
};

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const seedData: SeedSubject[] = [
  {
    title: "Java Programming",
    slug: "java-programming",
    description: "Learn Java fundamentals through a structured video path.",
    is_published: true,
    sections: [
      {
        title: "Getting Started",
        videos: [
          { title: "Intro", youtube_url: "https://www.youtube.com/watch?v=eIrMbAQSU34" },
          { title: "Variables", youtube_url: "https://www.youtube.com/watch?v=GoXwIVyNvX0" },
          { title: "OOP", youtube_url: "https://www.youtube.com/watch?v=8cm1x4bC610" }
        ]
      },
      {
        title: "Core Concepts",
        videos: [
          { title: "Intro", youtube_url: "https://www.youtube.com/watch?v=eIrMbAQSU34" },
          { title: "Variables", youtube_url: "https://www.youtube.com/watch?v=GoXwIVyNvX0" },
          { title: "OOP", youtube_url: "https://www.youtube.com/watch?v=8cm1x4bC610" }
        ]
      }
    ]
  },
  {
    title: "Python Fundamentals",
    slug: "python-fundamentals",
    description: "A clean path through Python basics and core syntax.",
    is_published: true,
    sections: [
      {
        title: "Getting Started",
        videos: [
          { title: "Intro", youtube_url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc" },
          { title: "Data Types", youtube_url: "https://www.youtube.com/watch?v=khKv-8q7YmY" },
          { title: "Functions", youtube_url: "https://www.youtube.com/watch?v=NSbOtYzIQI0" }
        ]
      },
      {
        title: "Core Concepts",
        videos: [
          { title: "Intro", youtube_url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc" },
          { title: "Data Types", youtube_url: "https://www.youtube.com/watch?v=khKv-8q7YmY" },
          { title: "Functions", youtube_url: "https://www.youtube.com/watch?v=NSbOtYzIQI0" }
        ]
      }
    ]
  },
  {
    title: "Machine Learning Basics",
    slug: "machine-learning-basics",
    description: "Understand the core ML ideas with a short, ordered sequence.",
    is_published: true,
    sections: [
      {
        title: "Foundations",
        videos: [
          { title: "Intro", youtube_url: "https://www.youtube.com/watch?v=Gv9_4yMHFhI" },
          { title: "Linear Regression", youtube_url: "https://www.youtube.com/watch?v=JvS2triCgOY" },
          { title: "Neural Networks", youtube_url: "https://www.youtube.com/watch?v=aircAruvnKk" }
        ]
      },
      {
        title: "Core Concepts",
        videos: [
          { title: "Intro", youtube_url: "https://www.youtube.com/watch?v=Gv9_4yMHFhI" },
          { title: "Linear Regression", youtube_url: "https://www.youtube.com/watch?v=JvS2triCgOY" },
          { title: "Neural Networks", youtube_url: "https://www.youtube.com/watch?v=aircAruvnKk" }
        ]
      }
    ]
  }
].map((s) => ({ ...s, slug: s.slug || slugify(s.title) }));

async function main() {
  const conn = await dbPool.getConnection();
  try {
    const [countRows] = await conn.query<any[]>("SELECT COUNT(*) AS cnt FROM subjects");
    const cnt = Number(countRows?.[0]?.cnt ?? 0);
    if (cnt > 0) {
      // eslint-disable-next-line no-console
      console.log("Seed skipped: subjects table is not empty.");
      return;
    }

    await conn.beginTransaction();

    for (const subject of seedData) {
      const [subjectRes] = await conn.query<any>(
        "INSERT INTO subjects (title, slug, description, is_published, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
        [subject.title, subject.slug, subject.description, subject.is_published ? 1 : 0]
      );
      const subjectId = Number(subjectRes.insertId);

      let sectionOrder = 1;
      for (const section of subject.sections) {
        const [sectionRes] = await conn.query<any>(
          "INSERT INTO sections (subject_id, title, order_index, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
          [subjectId, section.title, sectionOrder]
        );
        const sectionId = Number(sectionRes.insertId);

        let videoOrder = 1;
        for (const video of section.videos) {
          await conn.query(
            "INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [
              sectionId,
              video.title,
              video.description ?? null,
              video.youtube_url,
              videoOrder,
              video.duration_seconds ?? null
            ]
          );
          videoOrder += 1;
        }

        sectionOrder += 1;
      }
    }

    await conn.commit();
    // eslint-disable-next-line no-console
    console.log("Seed complete: sample courses inserted.");
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

main()
  .then(() => dbPool.end())
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", err);
    try {
      await dbPool.end();
    } finally {
      process.exit(1);
    }
  });

