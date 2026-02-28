import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "../../codecamp.db");
const db = new Database(dbPath);

export function setupDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('fresher', 'senior', 'admin')) NOT NULL DEFAULT 'fresher',
      college TEXT,
      year TEXT,
      interests TEXT,
      skill_level TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL DEFAULT 0,
      level TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      progress INTEGER DEFAULT 0,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (course_id) REFERENCES courses (id)
    );

    CREATE TABLE IF NOT EXISTS mentorship_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fresher_id INTEGER NOT NULL,
      senior_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fresher_id) REFERENCES users (id),
      FOREIGN KEY (senior_id) REFERENCES users (id)
    );
  `);

  // Seed data
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, role, college, year, interests, skill_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Password is 'password123' hashed with bcrypt
    const hashedPw = "$2a$10$X1j/1/3G.1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1"; // dummy hash, just for seed
    
    insertUser.run("Admin User", "admin@codecamp.com", hashedPw, "admin", "CodeCamp HQ", "N/A", "Everything", "Expert");
    insertUser.run("Senior Dev", "senior@codecamp.com", hashedPw, "senior", "IIT Bombay", "4th Year", "Web, AI", "Advanced");
    insertUser.run("Fresher Student", "fresher@codecamp.com", hashedPw, "fresher", "NIT Trichy", "1st Year", "Web", "Beginner");
  }

  const courseCount = db.prepare("SELECT COUNT(*) as count FROM courses").get() as { count: number };
  if (courseCount.count === 0) {
    const insertCourse = db.prepare(`
      INSERT INTO courses (title, description, price, level, image_url)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertCourse.run(
      "First Year Survival Guide", 
      "Everything you need to know to navigate your first year of college, choose a domain, and start building projects.", 
      0, 
      "Beginner", 
      "https://picsum.photos/seed/survival/600/400"
    );
    insertCourse.run(
      "Web Dev for Absolute Beginners", 
      "Learn HTML, CSS, and JavaScript from scratch. Build your first portfolio website.", 
      499, 
      "Beginner", 
      "https://picsum.photos/seed/webdev/600/400"
    );
    insertCourse.run(
      "AI & Data Foundations", 
      "Introduction to Python, Data Science, and Machine Learning concepts for freshers.", 
      999, 
      "Intermediate", 
      "https://picsum.photos/seed/ai/600/400"
    );
  }
}

export default db;
