-- Insert sample skills
INSERT INTO skills (name, category) VALUES
('JavaScript', 'Programming'),
('Python', 'Programming'),
('Photoshop', 'Design'),
('Excel', 'Office'),
('Guitar', 'Music'),
('Spanish', 'Language'),
('Cooking', 'Lifestyle'),
('Photography', 'Creative'),
('Marketing', 'Business'),
('Yoga', 'Fitness')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users
INSERT INTO users (email, name, location, availability, is_public) VALUES
('john@example.com', 'John Doe', 'New York, NY', 'Weekends, Evenings', true),
('jane@example.com', 'Jane Smith', 'Los Angeles, CA', 'Weekdays after 6pm', true),
('admin@example.com', 'Admin User', 'San Francisco, CA', 'Flexible', true)
ON CONFLICT (email) DO NOTHING;

-- Make admin user an admin
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
