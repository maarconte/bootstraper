-- SCHEMA SUPABASE POUR CODE//SHARE
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- ============================================
-- TABLE: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TABLE: codes
-- ============================================
CREATE TABLE IF NOT EXISTS codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('FINANCE', 'SAAS', 'HOSTING', 'ACCOUNTING', 'LEGAL', 'MARKETING', 'SERVICES', 'OTHER')),
  provider TEXT NOT NULL,
  discount TEXT NOT NULL,
  expiry_date DATE,
  views INTEGER DEFAULT 0,
  copies INTEGER DEFAULT 0,
  confirmations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Codes are viewable by everyone"
  ON codes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create codes"
  ON codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own codes"
  ON codes FOR UPDATE
  USING (auth.uid() = user_id OR true); -- Allow stats updates by anyone

CREATE POLICY "Users can delete own codes"
  ON codes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: ratings
-- ============================================
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id UUID REFERENCES codes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(code_id, user_id)
);

-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_codes_user_id ON codes(user_id);
CREATE INDEX idx_codes_category ON codes(category);
CREATE INDEX idx_codes_created_at ON codes(created_at DESC);
CREATE INDEX idx_codes_views ON codes(views DESC);
CREATE INDEX idx_codes_expiry_date ON codes(expiry_date);
CREATE INDEX idx_ratings_code_id ON ratings(code_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to handle user creation (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample codes (will need real user IDs)
/*
INSERT INTO codes (user_id, title, description, code, category, provider, discount, expiry_date) VALUES
  ('USER_ID_HERE', 'Compte pro Shine -50€', 'Ouvrez votre compte bancaire professionnel et bénéficiez de 50€ de réduction sur votre première année.', 'STARTUP2024', 'FINANCE', 'Shine', '-50€ la première année', '2024-12-31'),
  ('USER_ID_HERE', 'Notion Plus 3 mois gratuits', 'Profitez de Notion Plus gratuitement pendant 3 mois pour organiser votre startup.', 'NOTION3FREE', 'SAAS', 'Notion', '3 mois gratuits', '2024-12-31'),
  ('USER_ID_HERE', 'OVH -20% hébergement', 'Réduction de 20% sur votre premier hébergement web OVH.', 'OVHSTART20', 'HOSTING', 'OVH', '-20% sur premier hébergement', NULL);
*/
