import { Request, Response } from "express";
import { dbPool } from "../../config/db";

export async function getSubjects(req: Request, res: Response) {
  try {
    const [rows] = await dbPool.query("SELECT * FROM subjects");

    res.json(rows);
  } catch (err) {
    console.error("Subjects query error:", err);

    res.status(500).json({
      error: "SUBJECT_QUERY_FAILED",
      details: err
    });
  }
}