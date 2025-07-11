-- Row Level Security (RLS) Policies
-- These policies control who can access what data

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE solves ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctf_config ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own data and other users' basic info
CREATE POLICY "Users can view all users basic info" ON users
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Only authenticated users can insert (handled by trigger)
CREATE POLICY "Authenticated users can insert" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Teams table policies
-- Everyone can view teams
CREATE POLICY "Anyone can view teams" ON teams
    FOR SELECT USING (true);

-- Authenticated users can create teams
CREATE POLICY "Authenticated users can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Team creators can update their teams
CREATE POLICY "Team creators can update teams" ON teams
    FOR UPDATE USING (auth.uid() = created_by);

-- Team creators can delete their teams
CREATE POLICY "Team creators can delete teams" ON teams
    FOR DELETE USING (auth.uid() = created_by);

-- Challenges table policies
-- Everyone can view enabled challenges
CREATE POLICY "Anyone can view enabled challenges" ON challenges
    FOR SELECT USING (enabled = true OR EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

-- Only admins can manage challenges
CREATE POLICY "Only admins can manage challenges" ON challenges
    FOR ALL USING (EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

-- Solves table policies
-- Users can view all solves (for scoreboard)
CREATE POLICY "Anyone can view solves" ON solves
    FOR SELECT USING (true);

-- Users can insert their own solves
CREATE POLICY "Users can insert own solves" ON solves
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CTF Config policies
-- Everyone can read config
CREATE POLICY "Anyone can view ctf config" ON ctf_config
    FOR SELECT USING (true);

-- Only admins can update config
CREATE POLICY "Only admins can update ctf config" ON ctf_config
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));
