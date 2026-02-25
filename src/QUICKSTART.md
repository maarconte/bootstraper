# 🎯 GUIDE RAPIDE - CODE//SHARE

## 🚀 Pour commencer en 3 étapes

### 1️⃣ Configurer Supabase (5 min)
Ouvrez le fichier **`SUPABASE_SETUP.md`** et suivez les instructions.

En résumé :
1. Allez sur https://supabase.com/dashboard/project/gwtskrqupbaenmxtsnqz/sql
2. Copiez-collez le SQL du fichier `SUPABASE_SETUP.md`
3. Cliquez "Run"
4. Désactivez l'email confirmation dans les settings

### 2️⃣ Tester l'application
1. Cliquez sur **Preview** dans Figma Make
2. Créez un compte : Cliquez "Connexion" → "S'inscrire"
3. Remplissez le formulaire (username, email, password)
4. Vous êtes connecté !

### 3️⃣ Publier votre premier code
1. Cliquez sur **"+ Nouveau Code"**
2. Remplissez les informations
3. Cliquez **"Publier le code"**
4. Votre code apparaît dans la liste !

---

## 📁 Structure du Projet

```
/
├── App.tsx                     # Point d'entrée principal
├── components/
│   ├── layout/                # Header, Footer, Container
│   ├── codes/                 # Composants de codes
│   ├── auth/                  # Authentification
│   ├── ui/                    # Composants UI brutalist
│   └── stats/                 # Statistiques
├── lib/
│   ├── supabase.ts           # Client Supabase
│   ├── hooks.ts              # Hooks React personnalisés
│   └── utils.ts              # Fonctions utilitaires
├── types/
│   └── index.ts              # Types TypeScript
├── styles/
│   └── globals.css           # Styles brutalist
├── SUPABASE_SETUP.md         # 👈 COMMENCEZ ICI !
├── DEPLOYMENT.md             # Guide de déploiement complet
└── README.md                 # Documentation technique
```

---

## 🎨 Design Neo-Brutalist

Le design suit strictement ces principes :

### Typographie
- **Police** : Space Mono (monospace)
- **Tailles** : 3rem (H1), 2rem (H2), 1.5rem (H3)
- **Style** : UPPERCASE, gras

### Couleurs
- **Noir** : #000000 (texte, bordures)
- **Blanc** : #FFFFFF (fond principal)
- **Orange** : #FF6B00 (accent principal)
- **Gris** : #E5E5E5 (backgrounds secondaires)

### Éléments
- **Bordures** : 4px solid black
- **Ombres** : 8px 8px 0px black
- **Angles** : 0px (aucun arrondi)
- **Hover** : Inversion totale des couleurs

---

## 🔧 Fonctionnalités Principales

### Pour les utilisateurs
✅ **Découvrir** : Parcourir les codes avec filtres et recherche
✅ **Copier** : Copier un code en un clic
✅ **Noter** : Donner une note (1-5 étoiles) et commenter
✅ **Profil** : Voir ses codes et statistiques

### Pour les contributeurs
✅ **Publier** : Partager un code promo
✅ **Catégoriser** : Finance, SaaS, Hébergement, etc.
✅ **Suivre** : Voir les stats (vues, copies, validations)
✅ **Gérer** : Modifier ou supprimer ses codes

---

## 🗂️ Catégories Disponibles

1. **FINANCE** - Banques pro, néobanques (Shine, Qonto...)
2. **SAAS** - Outils logiciels (Notion, Slack, Figma...)
3. **HOSTING** - Hébergement web (OVH, Hostinger...)
4. **ACCOUNTING** - Comptabilité (Pennylane, Indy...)
5. **LEGAL** - Services juridiques (LegalPlace, Captain Contrat...)
6. **MARKETING** - Outils marketing (Mailchimp, Canva...)
7. **SERVICES** - Services divers
8. **OTHER** - Autres catégories

---

## 📊 Base de Données

### Tables Supabase

**profiles**
- Profils utilisateurs
- Créé automatiquement à l'inscription
- Stocke username, email, avatar

**codes**
- Codes promotionnels
- Lié à un utilisateur
- Stats : vues, copies, confirmations

**ratings**
- Notes et commentaires
- 1 note par utilisateur par code
- Rating de 1 à 5 étoiles

### Sécurité (RLS)
Toutes les tables ont Row Level Security activé :
- **Lecture** : Publique pour tous
- **Écriture** : Uniquement propriétaire
- **Stats** : Updateable par tous (pour compteurs)

---

## 🔍 Filtres et Recherche

### Filtres disponibles
- **Catégorie** : Toutes ou spécifique
- **Tri** : Récents, Populaires, Mieux notés, Expire bientôt
- **Expirés** : Afficher/Masquer

### Recherche
Recherche dans :
- Titre du code
- Description
- Nom du fournisseur

---

## 🎯 Roadmap

### Version actuelle (v1.0)
✅ Authentification complète
✅ CRUD codes
✅ Filtrage et recherche
✅ Système de notation
✅ Statistiques
✅ Design brutalist

### Prochaines versions

**v1.1 - Améliorations UX**
- [ ] Upvote/Downvote communautaire
- [ ] Notifications nouveaux codes
- [ ] Partage social
- [ ] Mode sombre

**v1.2 - Fonctionnalités avancées**
- [ ] API publique
- [ ] Extension navigateur
- [ ] Export CSV
- [ ] Badges utilisateurs

**v1.3 - Monétisation**
- [ ] Codes premium
- [ ] Affiliation
- [ ] Partenariats fournisseurs

---

## 🐛 Résolution de Problèmes

### L'application ne charge pas
1. Vérifiez la console (F12)
2. Regardez les erreurs réseau
3. Vérifiez que Supabase est configuré

### Impossible de se connecter
1. Vérifiez que les tables sont créées
2. Désactivez l'email confirmation
3. Essayez avec un autre email

### Les codes ne s'affichent pas
1. Ouvrez la console (F12)
2. Vérifiez les erreurs Supabase
3. Testez la requête dans SQL Editor

### Erreur "Failed to fetch"
1. Vérifiez les credentials dans `/utils/supabase/info.tsx`
2. Comparez avec Supabase Settings > API
3. Rechargez l'application

---

## 📞 Support & Ressources

### Documentation
- **SUPABASE_SETUP.md** : Configuration initiale
- **DEPLOYMENT.md** : Guide de déploiement complet
- **README.md** : Documentation technique

### Liens externes
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)

### Code Source
Tous les fichiers sont commentés et organisés logiquement.
N'hésitez pas à explorer `/components` pour comprendre l'architecture.

---

## ✨ Conseils pour Réussir

### Contenu de qualité
1. Ajoutez 10-20 codes dès le début
2. Variez les catégories
3. Vérifiez que les codes sont valides
4. Ajoutez des descriptions détaillées

### Marketing
1. Partagez sur LinkedIn (hashtags : #entrepreneurs #startup)
2. Postez sur Product Hunt
3. Contactez des communautés d'entrepreneurs
4. Créez du contenu (blog, Twitter)

### Engagement
1. Répondez aux utilisateurs
2. Modérez les codes régulièrement
3. Ajoutez de nouveaux codes chaque semaine
4. Écoutez le feedback

---

## 🎉 Vous êtes prêt !

**Prochaine étape** : Ouvrez `SUPABASE_SETUP.md` et configurez votre base de données !

**Questions ?** Consultez `DEPLOYMENT.md` pour le guide complet.

---

🔥 **CODE//SHARE** - Brutal. Simple. Efficace.

Made with ❤️ for entrepreneurs
