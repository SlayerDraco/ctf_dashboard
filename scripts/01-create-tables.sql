-- CTF Platform Database Schema
-- This script creates all the necessary tables for our CTF platform

-- Enable Row Level Security (RLS) for all tables
-- RLS ensures users can only access data they're authorized to see

-- 1. Users table - stores player information and roles
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role TEXT DEFAULT 'player' CHECK (role IN ('admin', 'player')),
    player_id TEXT UNIQUE, -- Format: PLAYER-XYZ123
    team_id UUID REFERENCES teams(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Teams table - stores team information
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Challenges table - stores CTF challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- Web, Crypto, Reverse, etc.
    points INTEGER NOT NULL DEFAULT 100,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5) DEFAULT 1,
    link TEXT, -- Optional external link
    file_path TEXT, -- Path to file in Supabase Storage
    flag TEXT NOT NULL, -- The correct flag (CTF{...})
    enabled BOOLEAN DEFAULT true,
    solve_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Solves table - tracks which challenges users have solved
CREATE TABLE IF NOT EXISTS solves (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    team_id UUID REFERENCES teams(id),
    challenge_id UUID REFERENCES challenges(id) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id) -- Prevent duplicate solves
);

-- 5. CTF Configuration table - manages CTF state and timing
CREATE TABLE IF NOT EXISTS ctf_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ctf_started BOOLEAN DEFAULT false,
    ctf_start_time TIMESTAMP WITH TIME ZONE,
    ctf_end_time TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default CTF configuration
INSERT INTO ctf_config (ctf_started, ctf_start_time, ctf_end_time) 
VALUES (false, NOW(), NOW() + INTERVAL '24 hours')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_player_id ON users(player_id);
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_solves_user_id ON solves(user_id);
CREATE INDEX IF NOT EXISTS idx_solves_challenge_id ON solves(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
