-- Database Functions and Triggers
-- These automate common tasks and maintain data consistency

-- Function to generate unique player ID
CREATE OR REPLACE FUNCTION generate_player_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate random player ID in format PLAYER-ABC123
        new_id := 'PLAYER-' || 
                  chr(65 + floor(random() * 26)::int) ||
                  chr(65 + floor(random() * 26)::int) ||
                  chr(65 + floor(random() * 26)::int) ||
                  floor(random() * 900 + 100)::text;
        
        -- Check if this ID already exists
        SELECT COUNT(*) INTO exists_check FROM users WHERE player_id = new_id;
        
        -- If unique, break the loop
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, display_name, player_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        generate_player_id()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update solve count when a challenge is solved
CREATE OR REPLACE FUNCTION update_solve_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment solve count for the challenge
    UPDATE challenges 
    SET solve_count = solve_count + 1 
    WHERE id = NEW.challenge_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update solve count
DROP TRIGGER IF EXISTS on_solve_inserted ON solves;
CREATE TRIGGER on_solve_inserted
    AFTER INSERT ON solves
    FOR EACH ROW EXECUTE FUNCTION update_solve_count();

-- Function to get team leaderboard
CREATE OR REPLACE FUNCTION get_team_leaderboard()
RETURNS TABLE (
    team_id UUID,
    team_name TEXT,
    total_score BIGINT,
    solve_count BIGINT,
    last_solve_time TIMESTAMP WITH TIME ZONE,
    max_difficulty INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id as team_id,
        t.name as team_name,
        COALESCE(SUM(c.points), 0) as total_score,
        COUNT(s.id) as solve_count,
        MAX(s.submitted_at) as last_solve_time,
        COALESCE(MAX(c.difficulty), 0) as max_difficulty
    FROM teams t
    LEFT JOIN solves s ON t.id = s.team_id
    LEFT JOIN challenges c ON s.challenge_id = c.id
    GROUP BY t.id, t.name
    ORDER BY total_score DESC, last_solve_time ASC;
END;
$$ LANGUAGE plpgsql;
