import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const courses = db.prepare("SELECT * FROM courses ORDER BY created_at DESC").all();
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
