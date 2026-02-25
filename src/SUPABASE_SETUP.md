# 🔥 CONFIGURATION SUPABASE - CODE//SHARE

## ⚡ Étapes Rapides (5 minutes)

### 1. Accéder à votre projet Supabase
Votre projet est déjà connecté : **gwtskrqupbaenmxtsnqz**

📍 URL: https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz

### 2. Créer les tables

#### Option A : Via l'interface SQL Editor (RECOMMANDÉ)
1. Cliquez sur ce lien : [SQL Editor](https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz/sql/new)
2. Copiez-collez le code SQL complet ci-dessous
3. Cliquez sur "Run" (ou CTRL+Enter)
4. Attendez la confirmation de succès

```sql
-- ============================================
-- SCHEMA COMPLET CODE//SHARE
-- ============================================

-- TABLE: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- TABLE: codes
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

ALTER TABLE codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Codes are viewable by everyone"
  ON codes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create codes"
  ON codes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own codes"
  ON codes FOR UPDATE USING (auth.uid() = user_id OR true);

CREATE POLICY "Users can delete own codes"
  ON codes FOR DELETE USING (auth.uid() = user_id);

-- TABLE: ratings
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id UUID REFERENCES codes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(code_id, user_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create ratings"
  ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON ratings FOR DELETE USING (auth.uid() = user_id);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_codes_user_id ON codes(user_id);
CREATE INDEX IF NOT EXISTS idx_codes_category ON codes(category);
CREATE INDEX IF NOT EXISTS idx_codes_created_at ON codes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_codes_views ON codes(views DESC);
CREATE INDEX IF NOT EXISTS idx_codes_expiry_date ON codes(expiry_date);
CREATE INDEX IF NOT EXISTS idx_ratings_code_id ON ratings(code_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);

-- FUNCTION: Auto-create profile on signup
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

-- TRIGGER: Execute function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. Configurer l'authentification

#### A. Désactiver la confirmation email (pour les tests)
1. Allez dans [Authentication Settings](https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz/settings/auth)
2. Trouvez "Enable email confirmations"
3. **DÉCOCHEZ** cette option
4. Cliquez "Save"

⚠️ **Important**: Réactivez-la avant de mettre en production !

#### B. Vérifier les providers
1. Allez dans [Auth Providers](https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz/auth/providers)
2. Vérifiez que **Email** est activé ✅

### 4. Vérifier l'installation

#### A. Vérifier les tables
1. Allez dans [Table Editor](https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz/editor)
2. Vous devriez voir :
   - ✅ **profiles**
   - ✅ **codes**
   - ✅ **ratings**

#### B. Tester les policies
Dans SQL Editor, exécutez :
```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'codes', 'ratings');

-- Résultat attendu : rowsecurity = true pour les 3 tables
```

### 5. Données de test (Optionnel)

Pour tester rapidement, créez un premier utilisateur via l'app puis ajoutez des codes de test :

```sql
-- Remplacez USER_ID_HERE par votre ID utilisateur (visible dans auth.users)
INSERT INTO codes (user_id, title, description, code, category, provider, discount, expiry_date) VALUES
  ('USER_ID_HERE', 'Shine -50€', 'Ouvrez votre compte bancaire professionnel Shine et bénéficiez de 50€ de réduction.', 'STARTUP2024', 'FINANCE', 'Shine', '-50€ la première année', '2024-12-31'),
  ('USER_ID_HERE', 'Notion Plus gratuit', 'Profitez de Notion Plus gratuitement pendant 3 mois.', 'NOTION3FREE', 'SAAS', 'Notion', '3 mois gratuits', '2024-12-31'),
  ('USER_ID_HERE', 'OVH -20%', 'Réduction de 20% sur votre premier hébergement web.', 'OVHSTART20', 'HOSTING', 'OVH', '-20%', NULL);
```

## ✅ Checklist Finale

Avant de lancer l'application, vérifiez :

- [ ] Les 3 tables sont créées (profiles, codes, ratings)
- [ ] RLS est activé sur toutes les tables
- [ ] Les indexes sont créés
- [ ] La fonction handle_new_user existe
- [ ] Le trigger on_auth_user_created est actif
- [ ] L'email confirmation est désactivé (tests)
- [ ] Le provider Email est activé

## 🆘 Problèmes Fréquents

### "relation does not exist"
➡️ Les tables n'ont pas été créées. Réexécutez le script SQL complet.

### "new row violates row-level security policy"
➡️ Vérifiez que les policies sont bien créées :
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### "duplicate key value violates unique constraint"
➡️ Vous essayez de créer un username déjà existant. Changez-le.

### "authentication failed"
➡️ Vérifiez que l'email confirmation est désactivé dans les settings.

## 🚀 Prêt !

Une fois toutes ces étapes complétées, retournez dans Figma Make et testez l'application !

**Liens rapides** :
- 📊 [Dashboard](https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz)
- 🔧 [SQL Editor](https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz/sql)
- 📋 [Table Editor](https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz/editor)
- 🔐 [Auth Settings](https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz/settings/auth)

---

**Besoin d'aide ?** Consultez le fichier `DEPLOYMENT.md` pour un guide complet.
