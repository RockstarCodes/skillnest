import { Request, Response } from "express";
import { dbPool } from "../../config/db";

export async function getSubjectTree(req: Request, res: Response) {
  const subjectId = Number(req.params.subjectId);

  const [sections]: any = await dbPool.query(
    `
    SELECT id, title, order_index
    FROM sections
    WHERE subject_id = ?
    ORDER BY order_index
    `,
    [subjectId]
  );

  for (const section of sections) {
    const [videos]: any = await dbPool.query(
      `
      SELECT id, title, youtube_url, order_index
      FROM videos
      WHERE section_id = ?
      ORDER BY order_index
      `,
      [section.id]
    );

    section.videos = videos;
  }

  res.json({
    subjectId,
    sections
  });
}