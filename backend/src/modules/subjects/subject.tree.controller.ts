import { Request, Response } from "express";
import { dbPool } from "../../config/db";

export async function getSubjectTree(req: Request, res: Response) {
  try {
    const subjectId = req.params.id;

    const [sections]: any = await dbPool.query(
      `
      SELECT id, title
      FROM sections
      WHERE subject_id = ?
      ORDER BY order_index ASC
      `,
      [subjectId]
    );

    for (const section of sections) {
      const [videos]: any = await dbPool.query(
        `
        SELECT id, title, youtube_url
        FROM videos
        WHERE section_id = ?
        ORDER BY order_index ASC
        `,
        [section.id]
      );

      section.videos = videos;
    }

    res.json({
      sections
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR"
    });
  }
}