import { Request, Response, NextFunction } from "express";
import { pool } from "../../config/db";

export async function getSubjects(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        id,
        title,
        slug,
        description,
        created_at,
        updated_at
      FROM subjects
      WHERE is_published = 1
      ORDER BY created_at DESC
      `
    );

    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}