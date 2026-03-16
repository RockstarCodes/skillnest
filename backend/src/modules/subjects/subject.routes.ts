import { Router } from "express";
import { getSubjects } from "./subject.controller";
import { getSubjectTree } from "./subject.tree.controller";


export const subjectRoutes = Router();

subjectRoutes.get("/:subjectId/tree", getSubjectTree);
subjectRoutes.get("/", getSubjects);

subjectRoutes.get("/test", (_req, res) => {
  res.json({ message: "Subjects route working" });
});