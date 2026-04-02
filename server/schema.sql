-- Longhorn Loop D1 Database Schema

-- Users table -- core profile info from onboarding
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar INTEGER,
  year_classification TEXT,
  unique_classification TEXT,
  agreed_responsible_use INTEGER NOT NULL DEFAULT 0,
  agreed_visibility_acknowledgment INTEGER NOT NULL DEFAULT 0,
  agreed_community_guidelines INTEGER NOT NULL DEFAULT 0,
  notifications_enabled INTEGER NOT NULL DEFAULT 0,
  terms_accepted_at TEXT,
  onboarding_completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- User majors -- supports multiple majors per user
CREATE TABLE IF NOT EXISTS user_majors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  major TEXT NOT NULL,
  UNIQUE(user_id, major)
);

-- User interest tags -- selected during onboarding
CREATE TABLE IF NOT EXISTS user_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(user_id, tag)
);

-- Verification codes -- replaces the in-memory authStore
CREATE TABLE IF NOT EXISTS verification_codes (
  email TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  used_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_sent_at INTEGER NOT NULL
);
