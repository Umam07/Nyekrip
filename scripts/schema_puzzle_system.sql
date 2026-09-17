-- ==============================================================================
-- Kodera - Skema Data Supabase: Sistem Soal Puzzle & Auto-Judge Scalable
-- ==============================================================================

-- 1. TABEL SOAL PUZZLE (Latihan Interaktif: Code Puzzle, Multiple Choice, Line Reorder)
CREATE TABLE IF NOT EXISTS soal_puzzle (
    id TEXT PRIMARY KEY,                       -- e.g. 'dnd-var-1' atau UUID
    modul_id TEXT NOT NULL,                    -- slug modul, e.g. 'variabel-dan-tipe-data'
    urutan INT NOT NULL DEFAULT 1,             -- urutan soal di dalam modul
    judul TEXT NOT NULL,                       -- judul soal
    instruksi TEXT,                            -- penjelasan instruksi pengerjaan
    tingkat_kesulitan TEXT NOT NULL CHECK (tingkat_kesulitan IN ('easy', 'medium', 'hard')),
    tipe TEXT NOT NULL DEFAULT 'code_puzzle' CHECK (tipe IN ('code_puzzle', 'multiple_choice', 'code_order', 'concept_order')),
    xp_reward INT NOT NULL DEFAULT 15,
    code_snippet TEXT,                         -- template kode dengan slot {slot_1} dst
    slots JSONB DEFAULT '{}'::jsonb,           -- mapping slot { "slot_1": "String" }
    tokens JSONB DEFAULT '[]'::jsonb,          -- bank token kepingan puzzle
    question TEXT,                             -- untuk pilihan ganda
    options JSONB DEFAULT '[]'::jsonb,         -- opsi pilihan ganda
    solution_explanation TEXT,                 -- pembahasan mendalam
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_soal_puzzle_modul ON soal_puzzle(modul_id, urutan);

-- 2. TABEL PROGRESS USER PER SOAL PUZZLE
CREATE TABLE IF NOT EXISTS user_progress_puzzle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,                     -- id auth pengguna (auth.users atau profiles.id)
    soal_id TEXT NOT NULL REFERENCES soal_puzzle(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'belum' CHECK (status IN ('belum', 'proses', 'selesai')),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, soal_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_puzzle_user ON user_progress_puzzle(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_puzzle_soal ON user_progress_puzzle(soal_id);

-- 3. TABEL SOAL AUTO-JUDGE (Coding Playground Problem)
CREATE TABLE IF NOT EXISTS soal_autojudge (
    id TEXT PRIMARY KEY,                       -- e.g. 'code-var-1'
    modul_id TEXT NOT NULL,
    urutan INT NOT NULL DEFAULT 1,
    judul TEXT NOT NULL,
    deskripsi TEXT NOT NULL,                   -- problem statement markdown
    tingkat_kesulitan TEXT NOT NULL CHECK (tingkat_kesulitan IN ('easy', 'medium', 'hard')),
    xp_reward INT NOT NULL DEFAULT 30,
    starter_code TEXT NOT NULL,
    solution_code TEXT,
    method_signature TEXT,
    test_cases JSONB DEFAULT '[]'::jsonb,      -- array of { id, input, expected, isHidden }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_soal_autojudge_modul ON soal_autojudge(modul_id, urutan);

-- 4. TABEL PROGRESS USER PER SOAL AUTO-JUDGE
CREATE TABLE IF NOT EXISTS user_progress_autojudge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    soal_id TEXT NOT NULL REFERENCES soal_autojudge(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'belum' CHECK (status IN ('belum', 'proses', 'selesai')),
    last_code TEXT,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, soal_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_autojudge_user ON user_progress_autojudge(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE soal_puzzle ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_puzzle ENABLE ROW LEVEL SECURITY;
ALTER TABLE soal_autojudge ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_autojudge ENABLE ROW LEVEL SECURITY;

-- Semua orang bisa membaca daftar soal
CREATE POLICY "Public read soal_puzzle" ON soal_puzzle FOR SELECT USING (true);
CREATE POLICY "Public read soal_autojudge" ON soal_autojudge FOR SELECT USING (true);

-- User hanya bisa melihat dan mengupdate progress miliknya sendiri
CREATE POLICY "Users read own progress puzzle" ON user_progress_puzzle 
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users insert/update own progress puzzle" ON user_progress_puzzle 
    FOR ALL USING (auth.uid() = user_id OR user_id IS NOT NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users read own progress autojudge" ON user_progress_autojudge 
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users insert/update own progress autojudge" ON user_progress_autojudge 
    FOR ALL USING (auth.uid() = user_id OR user_id IS NOT NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NOT NULL);
