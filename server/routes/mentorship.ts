import express from "express";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-codecamp-key";

// Middleware to authenticate
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/seniors", authenticate, (req, res) => {
  try {
    const seniors = db.prepare("SELECT id, name, college, year, interests, skill_level FROM users WHERE role = 'senior'").all();
    res.json({ seniors });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/request", authenticate, (req: any, res) => {
  const { senior_id, message } = req.body;
  const fresher_id = req.user.id;

  if (req.user.role !== 'fresher') {
    return res.status(403).json({ error: "Only freshers can request mentorship" });
  }

  try {
    const insert = db.prepare("INSERT INTO mentorship_requests (fresher_id, senior_id, message) VALUES (?, ?, ?)");
    insert.run(fresher_id, senior_id, message);
    res.status(201).json({ message: "Mentorship request sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/requests", authenticate, (req: any, res) => {
  const user_id = req.user.id;
  const role = req.user.role;

  try {
    if (role === 'senior') {
      const requests = db.prepare(`
        SELECT mr.id, mr.status, mr.message, mr.created_at, u.name as fresher_name, u.college as fresher_college
        FROM mentorship_requests mr
        JOIN users u ON mr.fresher_id = u.id
        WHERE mr.senior_id = ?
        ORDER BY mr.created_at DESC
      `).all(user_id);
      res.json({ requests });
    } else if (role === 'fresher') {
      const requests = db.prepare(`
        SELECT mr.id, mr.status, mr.message, mr.created_at, u.name as senior_name, u.college as senior_college
        FROM mentorship_requests mr
        JOIN users u ON mr.senior_id = u.id
        WHERE mr.fresher_id = ?
        ORDER BY mr.created_at DESC
      `).all(user_id);
      res.json({ requests });
    } else {
      res.status(403).json({ error: "Admins don't have mentorship requests" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/request/:id", authenticate, (req: any, res) => {
  const { status } = req.body;
  const request_id = req.params.id;
  const senior_id = req.user.id;

  if (req.user.role !== 'senior') {
    return res.status(403).json({ error: "Only seniors can update requests" });
  }

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const update = db.prepare("UPDATE mentorship_requests SET status = ? WHERE id = ? AND senior_id = ?");
    const info = update.run(status, request_id, senior_id);
    
    if (info.changes === 0) {
      return res.status(404).json({ error: "Request not found or unauthorized" });
    }
    
    res.json({ message: "Request updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
