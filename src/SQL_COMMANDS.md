# 🔧 COMMANDES SQL UTILES - CODE//SHARE

Collection de requêtes SQL pratiques pour gérer votre plateforme Supabase.

---

## 📊 STATISTIQUES & MONITORING

### Vue d'ensemble générale
```sql
-- Dashboard complet
SELECT 
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM codes) as total_codes,
  (SELECT COUNT(*) FROM ratings) as total_ratings,
  (SELECT SUM(views) FROM codes) as total_views,
  (SELECT SUM(copies) FROM codes) as total_copies,
  (SELECT SUM(confirmations) FROM codes) as total_confirmations;
```

### Top 10 codes les plus populaires
```sql
SELECT 
  title,
  provider,
  category,
  views,
  copies,
  confirmations
FROM codes
ORDER BY views DESC
LIMIT 10;
```

### Codes par catégorie
```sql
SELECT 
  category,
  COUNT(*) as total_codes,
  SUM(views) as total_views,
  SUM(copies) as total_copies
FROM codes
GROUP BY category
ORDER BY total_codes DESC;
```

### Utilisateurs les plus actifs
```sql
SELECT 
  p.username,
  p.email,
  COUNT(c.id) as codes_published,
  SUM(c.views) as total_views,
  SUM(c.copies) as total_copies
FROM profiles p
LEFT JOIN codes c ON p.id = c.user_id
GROUP BY p.id, p.username, p.email
ORDER BY codes_published DESC
LIMIT 10;
```

### Codes expirés ou expirant bientôt
```sql
-- Codes expirés
SELECT title, provider, expiry_date, views, copies
FROM codes
WHERE expiry_date < CURRENT_DATE
ORDER BY expiry_date DESC;

-- Codes expirant dans les 7 prochains jours
SELECT title, provider, expiry_date, CURRENT_DATE - expiry_date as days_left
FROM codes
WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY expiry_date ASC;
```

### Codes sans avis
```sql
SELECT c.title, c.provider, c.views, c.copies
FROM codes c
LEFT JOIN ratings r ON c.id = r.code_id
WHERE r.id IS NULL AND c.views > 10
ORDER BY c.views DESC;
```

---

## 🎯 MODÉRATION & MAINTENANCE

### Supprimer les codes expirés depuis plus de 30 jours
```sql
-- ATTENTION : Sauvegardez avant !
DELETE FROM codes
WHERE expiry_date < CURRENT_DATE - INTERVAL '30 days';
```

### Trouver les doublons potentiels
```sql
SELECT code, COUNT(*) as occurrences
FROM codes
GROUP BY code
HAVING COUNT(*) > 1;
```

### Codes avec descriptions courtes (probable spam)
```sql
SELECT id, title, description, LENGTH(description) as desc_length
FROM codes
WHERE LENGTH(description) < 50
ORDER BY desc_length ASC;
```

### Utilisateurs suspects (trop de codes publiés rapidement)
```sql
SELECT 
  p.username,
  COUNT(c.id) as codes_count,
  MIN(c.created_at) as first_code,
  MAX(c.created_at) as last_code
FROM profiles p
JOIN codes c ON p.id = c.user_id
WHERE c.created_at > CURRENT_DATE - INTERVAL '1 day'
GROUP BY p.id, p.username
HAVING COUNT(c.id) > 10
ORDER BY codes_count DESC;
```

---

## 🔍 RECHERCHE & ANALYSE

### Rechercher un code spécifique
```sql
SELECT *
FROM codes
WHERE 
  title ILIKE '%shine%' OR
  description ILIKE '%shine%' OR
  provider ILIKE '%shine%' OR
  code ILIKE '%shine%';
```

### Codes les mieux notés
```sql
SELECT 
  c.title,
  c.provider,
  c.category,
  ROUND(AVG(r.rating)::numeric, 2) as avg_rating,
  COUNT(r.id) as rating_count
FROM codes c
JOIN ratings r ON c.id = r.code_id
GROUP BY c.id, c.title, c.provider, c.category
HAVING COUNT(r.id) >= 3  -- Au moins 3 avis
ORDER BY avg_rating DESC, rating_count DESC
LIMIT 20;
```

### Codes peu performants
```sql
SELECT 
  title,
  provider,
  category,
  created_at,
  views,
  copies,
  ROUND((copies::float / NULLIF(views, 0) * 100), 2) as conversion_rate
FROM codes
WHERE views > 50 AND copies < 5
ORDER BY conversion_rate ASC;
```

### Analyse temporelle (tendances)
```sql
SELECT 
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as codes_added,
  SUM(views) as total_views
FROM codes
GROUP BY week
ORDER BY week DESC
LIMIT 12;  -- 12 dernières semaines
```

---

## 👥 GESTION DES UTILISATEURS

### Utilisateurs inscrits récemment
```sql
SELECT 
  username,
  email,
  created_at
FROM profiles
WHERE created_at > CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Utilisateurs sans codes publiés
```sql
SELECT 
  p.username,
  p.email,
  p.created_at
FROM profiles p
LEFT JOIN codes c ON p.id = c.user_id
WHERE c.id IS NULL
ORDER BY p.created_at DESC;
```

### Trouver un utilisateur par email
```sql
SELECT 
  p.*,
  COUNT(c.id) as codes_count,
  COUNT(r.id) as ratings_count
FROM profiles p
LEFT JOIN codes c ON p.id = c.user_id
LEFT JOIN ratings r ON p.id = r.user_id
WHERE p.email = 'user@example.com'
GROUP BY p.id;
```

---

## 📝 INSERTION & MISE À JOUR

### Ajouter un code manuellement
```sql
-- Trouvez d'abord votre user_id
SELECT id FROM profiles WHERE email = 'votre@email.com';

-- Puis insérez le code
INSERT INTO codes (
  user_id,
  title,
  description,
  code,
  category,
  provider,
  discount,
  expiry_date
) VALUES (
  'VOTRE_USER_ID',
  'Titre du code',
  'Description détaillée...',
  'CODE2024',
  'FINANCE',
  'Nom du fournisseur',
  '-50€',
  '2024-12-31'
);
```

### Mettre à jour un code
```sql
UPDATE codes
SET 
  title = 'Nouveau titre',
  description = 'Nouvelle description',
  expiry_date = '2025-06-30'
WHERE id = 'CODE_ID_HERE' AND user_id = 'VOTRE_USER_ID';
```

### Incrémenter les stats manuellement
```sql
-- Si besoin de corriger les stats
UPDATE codes
SET views = views + 10
WHERE id = 'CODE_ID';
```

---

## 🗑️ NETTOYAGE & SUPPRESSION

### Supprimer un code spécifique
```sql
DELETE FROM codes
WHERE id = 'CODE_ID' AND user_id = 'VOTRE_USER_ID';
```

### Supprimer tous les codes d'un utilisateur
```sql
-- ATTENTION : Irréversible !
DELETE FROM codes
WHERE user_id = 'USER_ID';
```

### Supprimer un utilisateur et toutes ses données
```sql
-- Les codes et ratings seront supprimés automatiquement (CASCADE)
DELETE FROM profiles
WHERE id = 'USER_ID';
```

### Nettoyer les ratings orphelins (si besoin)
```sql
DELETE FROM ratings
WHERE code_id NOT IN (SELECT id FROM codes);
```

---

## 💾 BACKUP & EXPORT

### Exporter tous les codes en CSV
```sql
COPY (
  SELECT 
    c.title,
    c.description,
    c.code,
    c.category,
    c.provider,
    c.discount,
    c.expiry_date,
    c.views,
    c.copies,
    c.confirmations,
    c.created_at,
    p.username as author
  FROM codes c
  JOIN profiles p ON c.user_id = p.id
  ORDER BY c.created_at DESC
) TO '/tmp/codes_export.csv' CSV HEADER;
```

### Exporter les codes par catégorie
```sql
COPY (
  SELECT * FROM codes WHERE category = 'FINANCE'
) TO '/tmp/codes_finance.csv' CSV HEADER;
```

### Backup complet JSON
```sql
SELECT json_agg(row_to_json(codes)) 
FROM codes;
```

---

## 🔐 SÉCURITÉ & PERMISSIONS

### Vérifier les policies RLS
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Vérifier que RLS est activé
```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- rowsecurity doit être 'true'
```

### Tester les permissions (en tant qu'utilisateur)
```sql
-- Simuler un utilisateur spécifique
SET LOCAL "request.jwt.claim.sub" = 'USER_ID';

-- Tester la requête
SELECT * FROM codes WHERE user_id = 'USER_ID';

-- Réinitialiser
RESET "request.jwt.claim.sub";
```

---

## 🔧 MAINTENANCE DATABASE

### Taille des tables
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Optimiser les performances (VACUUM)
```sql
-- Nettoyer et analyser
VACUUM ANALYZE codes;
VACUUM ANALYZE profiles;
VACUUM ANALYZE ratings;
```

### Vérifier les indexes
```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Reconstruire les indexes (si lenteur)
```sql
REINDEX TABLE codes;
REINDEX TABLE profiles;
REINDEX TABLE ratings;
```

---

## 📊 RAPPORTS AVANCÉS

### Rapport hebdomadaire
```sql
SELECT 
  'Nouveaux utilisateurs' as metric,
  COUNT(*) as count
FROM profiles
WHERE created_at > CURRENT_DATE - INTERVAL '7 days'

UNION ALL

SELECT 
  'Nouveaux codes' as metric,
  COUNT(*) as count
FROM codes
WHERE created_at > CURRENT_DATE - INTERVAL '7 days'

UNION ALL

SELECT 
  'Nouveaux avis' as metric,
  COUNT(*) as count
FROM ratings
WHERE created_at > CURRENT_DATE - INTERVAL '7 days';
```

### Funnel de conversion
```sql
SELECT 
  category,
  SUM(views) as views,
  SUM(copies) as copies,
  ROUND((SUM(copies)::float / NULLIF(SUM(views), 0) * 100), 2) as conversion_rate
FROM codes
GROUP BY category
ORDER BY conversion_rate DESC;
```

### Rétention utilisateurs
```sql
SELECT 
  DATE_TRUNC('month', p.created_at) as signup_month,
  COUNT(DISTINCT p.id) as users_signed_up,
  COUNT(DISTINCT c.user_id) as users_who_posted
FROM profiles p
LEFT JOIN codes c ON p.id = c.user_id 
  AND c.created_at > p.created_at + INTERVAL '7 days'
GROUP BY signup_month
ORDER BY signup_month DESC;
```

---

## ⚠️ AVERTISSEMENTS

### Avant d'exécuter des DELETE
```sql
-- TOUJOURS faire un SELECT d'abord !
SELECT * FROM codes WHERE ...;  -- Vérifiez ce qui sera supprimé
-- DELETE FROM codes WHERE ...;  -- Puis décommentez
```

### Avant modification de structure
```sql
-- Toujours sauvegarder d'abord
-- Utilisez les backups automatiques Supabase
-- Ou exportez manuellement avec COPY
```

---

## 🆘 RESTAURATION D'URGENCE

### Restaurer un code supprimé par erreur
Si vous avez un backup récent :
```sql
-- Depuis votre backup CSV
COPY codes(user_id, title, description, code, category, provider, discount, expiry_date)
FROM '/path/to/backup.csv'
CSV HEADER;
```

### Point-in-time Recovery (Plan Pro)
1. Dashboard Supabase > Database > Backups
2. Sélectionnez le timestamp
3. Restaurez

---

## 📚 Ressources

- [Supabase SQL Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

---

**Besoin d'aide ?** Consultez la FAQ ou la documentation Supabase.

🔥 **CODE//SHARE** - Gérez votre base de données comme un pro !
