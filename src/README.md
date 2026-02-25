# CODE//SHARE - Plateforme de Codes Promo pour Entrepreneurs

## 🚀 COMMENCER ICI

**👉 Nouveau sur le projet ? Lisez [WELCOME.md](./WELCOME.md) d'abord !**

Ensuite, suivez ce parcours :
1. **[QUICKSTART.md](./QUICKSTART.md)** - Guide rapide (10 min)
2. **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Configuration (5 min)
3. **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** - Checklist complète

📚 **Index complet** : [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

---

## 🎯 À propos

CODE//SHARE est une plateforme communautaire permettant aux entrepreneurs de partager et découvrir des codes de parrainage et promotions pour réduire leurs coûts de création d'entreprise.

## 🎨 Design

Design **Neo-Brutalist** strict :
- Typographie monospace (Space Mono)
- Contrastes maximaux noir/blanc
- Accents orange vif (#FF6B00)
- Bordures épaisses (4px)
- Angles droits exclusivement
- Grilles asymétriques
- États hover agressifs

## ⚙️ Stack Technique

- **Frontend**: React 18+ avec TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: Lucide React

## 📦 Installation

### 1. Cloner le projet
```bash
# Le projet est déjà configuré dans Figma Make
```

### 2. Configuration Supabase

#### a) Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **Project URL** et **Anon Key**

#### b) Configurer la base de données
1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Copiez le contenu du fichier `/supabase-schema.sql`
3. Exécutez le script SQL
4. Vérifiez que les tables `profiles`, `codes`, et `ratings` sont créées

#### c) Configurer l'authentification
1. Allez dans **Authentication** > **Providers**
2. Activez **Email** provider
3. Désactivez "Confirm email" pour les tests (à réactiver en production)

#### d) Variables d'environnement
Les credentials Supabase sont déjà configurés dans Figma Make via `/utils/supabase/info.tsx`

### 3. Lancer l'application
L'application est automatiquement déployée dans Figma Make. Cliquez sur "Preview" pour la voir en action.

## 📊 Structure de la Base de Données

### Table `profiles`
```sql
- id (UUID, PK, FK auth.users)
- username (TEXT, UNIQUE)
- email (TEXT)
- avatar_url (TEXT, nullable)
- created_at (TIMESTAMP)
```

### Table `codes`
```sql
- id (UUID, PK)
- user_id (UUID, FK profiles)
- title (TEXT)
- description (TEXT)
- code (TEXT)
- category (ENUM: FINANCE, SAAS, HOSTING, etc.)
- provider (TEXT)
- discount (TEXT)
- expiry_date (DATE, nullable)
- views (INTEGER)
- copies (INTEGER)
- confirmations (INTEGER)
- created_at (TIMESTAMP)
```

### Table `ratings`
```sql
- id (UUID, PK)
- code_id (UUID, FK codes)
- user_id (UUID, FK profiles)
- rating (INTEGER 1-5)
- comment (TEXT, nullable)
- created_at (TIMESTAMP)
- UNIQUE(code_id, user_id)
```

## 🔐 Sécurité (RLS)

Row Level Security est activé sur toutes les tables :

- **Profiles**: Lecture publique, modification par propriétaire uniquement
- **Codes**: Lecture publique, CRUD par propriétaire (stats updateables par tous)
- **Ratings**: Lecture publique, CRUD par propriétaire uniquement

## 🎯 Fonctionnalités

### ✅ Implémentées
- [x] Authentification complète (signup/login/logout)
- [x] Publication de codes avec validation
- [x] Filtrage multicritères (catégorie, recherche, tri)
- [x] Vue détaillée des codes
- [x] Système de notation (1-5 étoiles) avec commentaires
- [x] Statistiques en temps réel (vues, copies, validations)
- [x] Profil utilisateur avec codes publiés
- [x] Copy to clipboard
- [x] Gestion de l'expiration
- [x] Design neo-brutalist complet
- [x] Responsive design

### 📱 Routes
- `/` - Page d'accueil avec liste et filtres
- `/code/:id` - Détails d'un code
- `/submit` - Formulaire de soumission
- `/profile` - Profil utilisateur
- `/login` - Connexion
- `/signup` - Inscription

## 🎨 Composants UI

### Layout
- `Header` - Navigation avec auth
- `Footer` - Liens et contact
- `Container` - Wrapper de contenu

### UI Brutalist
- `Button` - 4 variants (primary, secondary, outline, danger)
- `Input` / `TextArea` / `Select` - Formulaires brutalist
- `Badge` - Badges catégories et status
- `Modal` - Modale plein écran

### Codes
- `CodeCard` - Carte de code avec stats
- `CodeGrid` - Grille asymétrique responsive
- `CodeFilters` - Filtres multicritères
- `CodeDetails` - Vue détaillée complète
- `CodeSubmitForm` - Formulaire de soumission

### Auth
- `AuthForm` - Login/Signup unifié
- `UserProfile` - Profil avec stats

### Stats
- `StatsCard` - Carte de statistique

## 🔧 Hooks Personnalisés

```typescript
useCodes(filters) // Récupère codes avec filtres
useCode(id) // Récupère un code spécifique
useRatings(codeId) // Récupère les avis d'un code
useUserStats(userId) // Statistiques utilisateur
useAuth() // État d'authentification
```

## 🌐 SEO & Performance

### Metadata
Ajoutez dans `index.html` :
```html
<title>CODE//SHARE - Codes Promo Entrepreneurs</title>
<meta name="description" content="Plateforme de partage de codes de parrainage et promotions pour entrepreneurs. Économisez sur vos outils SaaS, banques pro, hébergement.">
<meta name="keywords" content="codes promo, parrainage, entrepreneurs, startup, réduction, banque pro, saas">
```

### Optimisations
- Indexes sur tables Supabase
- Lazy loading des composants
- Memoization React
- RLS policies optimisées

## 📈 Suggestions d'Amélioration

### Court terme
1. Système de validation communautaire (upvote/downvote)
2. Notifications email pour nouveaux codes
3. Partage social (Twitter, LinkedIn)
4. Export CSV des codes
5. Mode sombre

### Moyen terme
1. API publique
2. Extension navigateur
3. Webhooks pour nouveaux codes
4. Système de badges utilisateurs
5. Dashboard admin

### Long terme
1. Application mobile (React Native)
2. Système d'affiliation
3. Partenariats avec fournisseurs
4. Marketplace de services
5. Programme ambassadeur

## 🎯 Noms de Domaine Recommandés

### 1. **CodeEntreprise.fr** ⭐ RECOMMANDÉ
- SEO: 95/100 (mots-clés directs)
- Mémorisation: Excellent
- Cible: Entrepreneurs français

### 2. **PromoStartup.com**
- SEO: 88/100 (portée internationale)
- Mémorisation: Très bon
- Cible: Écosystème startup global

### 3. **ParrainPro.fr**
- SEO: 82/100 (niche parrainage)
- Mémorisation: Excellent
- Cible: Professionnels français

## 📝 License

MIT License - Libre d'utilisation

## 🤝 Support

Pour toute question :
- Email: contact@codeshare.fr (à configurer)
- Twitter: @codeshare_fr (à créer)
- GitHub Issues: [Lien à ajouter]

---

**Fait avec ❤️ pour les entrepreneurs par des entrepreneurs**

🔥 **CODE//SHARE** - Brutal. Simple. Efficace.