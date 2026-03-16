import { Router } from "express";
import { getSubjects } from "./subject.controller";

export const subjectRoutes = Router();

subjectRoutes.get("/", getSubjects);