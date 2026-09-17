const fs = require('fs');
const dotenv = fs.readFileSync('.env.local', 'utf8');
const lines = dotenv.split('\n');
let dbUrl = '';
for (const line of lines) {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.replace('DATABASE_URL=', '').trim().replace(/^"/, '').replace(/"$/, '');
    break;
  }
}

if (!dbUrl) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const { neon } = require('@neondatabase/serverless');
const sql = neon(dbUrl);

async function migrate() {
  console.log('Migrating database schema to Neon Postgres...');

  // 1. Core tables
  await sql`
    CREATE TABLE IF NOT EXISTS courses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      language TEXT NOT NULL,
      description TEXT,
      "order" INT NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS modules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      short_description TEXT,
      level_group INT NOT NULL DEFAULT 1,
      level_name TEXT NOT NULL,
      "order" INT NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS lessons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content_markdown TEXT NOT NULL,
      "order" INT NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS exercises (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('drag_drop', 'coding')),
      title TEXT NOT NULL,
      instruction TEXT,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
      xp_reward INT NOT NULL DEFAULT 15,
      "order" INT NOT NULL DEFAULT 1,
      required_level INT DEFAULT 1,
      solution_explanation TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS drag_drop_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
      code_fragment TEXT NOT NULL,
      correct_position INT NOT NULL,
      explanation TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS coding_problems (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      problem_statement TEXT NOT NULL,
      method_signature TEXT NOT NULL,
      starter_code TEXT NOT NULL,
      solution_code TEXT,
      time_limit_ms INT DEFAULT 2000,
      memory_limit_kb INT DEFAULT 128000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS test_cases (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      coding_problem_id UUID REFERENCES coding_problems(id) ON DELETE CASCADE,
      input TEXT NOT NULL,
      expected_output TEXT NOT NULL,
      is_hidden BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // 2. User profiles and progress linked to neon_auth.user
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      auth_user_id UUID UNIQUE REFERENCES neon_auth.user(id) ON DELETE CASCADE,
      display_name TEXT NOT NULL,
      email TEXT,
      campus TEXT DEFAULT 'Teknik Informatika',
      total_xp INT DEFAULT 0,
      level INT DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES neon_auth.user(id) ON DELETE CASCADE,
      lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'completed',
      completed_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, lesson_id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES neon_auth.user(id) ON DELETE CASCADE,
      exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
      submitted_code TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'wrong_answer', 'compile_error', 'runtime_error', 'time_limit_exceeded')),
      execution_time_ms INT,
      judge_result JSONB DEFAULT '{}'::jsonb,
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // 3. Interactive Puzzle & Auto-Judge system tables
  await sql`
    CREATE TABLE IF NOT EXISTS soal_puzzle (
      id TEXT PRIMARY KEY,
      modul_id TEXT NOT NULL,
      urutan INT NOT NULL DEFAULT 1,
      judul TEXT NOT NULL,
      instruksi TEXT,
      tingkat_kesulitan TEXT NOT NULL CHECK (tingkat_kesulitan IN ('easy', 'medium', 'hard')),
      tipe TEXT NOT NULL DEFAULT 'code_puzzle' CHECK (tipe IN ('code_puzzle', 'multiple_choice', 'code_order', 'concept_order')),
      xp_reward INT NOT NULL DEFAULT 15,
      code_snippet TEXT,
      slots JSONB DEFAULT '{}'::jsonb,
      tokens JSONB DEFAULT '[]'::jsonb,
      question TEXT,
      options JSONB DEFAULT '[]'::jsonb,
      solution_explanation TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_soal_puzzle_modul ON soal_puzzle(modul_id, urutan);
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_progress_puzzle (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES neon_auth.user(id) ON DELETE CASCADE,
      soal_id TEXT NOT NULL REFERENCES soal_puzzle(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'belum' CHECK (status IN ('belum', 'proses', 'selesai')),
      completed_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, soal_id)
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_user_progress_puzzle_user ON user_progress_puzzle(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_user_progress_puzzle_soal ON user_progress_puzzle(soal_id);`;

  await sql`
    CREATE TABLE IF NOT EXISTS soal_autojudge (
      id TEXT PRIMARY KEY,
      modul_id TEXT NOT NULL,
      urutan INT NOT NULL DEFAULT 1,
      judul TEXT NOT NULL,
      deskripsi TEXT NOT NULL,
      tingkat_kesulitan TEXT NOT NULL CHECK (tingkat_kesulitan IN ('easy', 'medium', 'hard')),
      xp_reward INT NOT NULL DEFAULT 30,
      starter_code TEXT NOT NULL,
      solution_code TEXT,
      method_signature TEXT,
      test_cases JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_soal_autojudge_modul ON soal_autojudge(modul_id, urutan);
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_progress_autojudge (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES neon_auth.user(id) ON DELETE CASCADE,
      soal_id TEXT NOT NULL REFERENCES soal_autojudge(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'belum' CHECK (status IN ('belum', 'proses', 'selesai')),
      last_code TEXT,
      completed_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, soal_id)
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_user_progress_autojudge_user ON user_progress_autojudge(user_id);
  `;

  console.log('Migration completed successfully!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
