-- Seed Data for Testing
-- This creates sample challenges and an admin user for testing

-- Insert sample challenges
INSERT INTO challenges (title, description, category, points, difficulty, flag) VALUES
('Welcome to CTF', 'Find the flag in the source code of this page. Hint: Check the HTML comments!', 'Web', 50, 1, 'CTF{welcome_to_the_game}'),
('Basic Crypto', 'Decode this Base64 string: Q1RGe2Jhc2U2NF9pc19lYXN5fQ==', 'Crypto', 100, 2, 'CTF{base64_is_easy}'),
('SQL Injection', 'Find the admin password in this vulnerable login form.', 'Web', 200, 3, 'CTF{sql_injection_master}'),
('Reverse Engineering', 'Analyze this binary and find the hidden flag.', 'Reverse', 300, 4, 'CTF{reverse_engineering_pro}'),
('Advanced Crypto', 'Break this custom encryption algorithm.', 'Crypto', 500, 5, 'CTF{crypto_wizard}'),
('Network Analysis', 'Analyze the network traffic to find the flag.', 'Forensics', 150, 2, 'CTF{network_detective}'),
('Buffer Overflow', 'Exploit this buffer overflow vulnerability.', 'Pwn', 400, 4, 'CTF{buffer_overflow_hacker}'),
('Steganography', 'The flag is hidden in this image.', 'Forensics', 100, 2, 'CTF{hidden_in_plain_sight}');

-- Note: To create an admin user, you'll need to:
-- 1. Sign up normally through the app
-- 2. Then run this query to promote them to admin:
-- UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
