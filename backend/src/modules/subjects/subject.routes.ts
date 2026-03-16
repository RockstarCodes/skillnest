import { Router } from "express";
import { getSubjects } from "./subject.controller";

export const subjectRoutes = Router();

subjectRoutes.get("/", getSubjects);

subjectRoutes.get("/test", (_req, res) => {
  res.json({ message: "Subjects route working" });
});