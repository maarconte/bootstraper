# ❓ FAQ - CODE//SHARE

## Questions Générales

### Qu'est-ce que CODE//SHARE ?
CODE//SHARE est une plateforme communautaire permettant aux entrepreneurs de partager et découvrir des codes de parrainage et promotions pour réduire leurs coûts de création d'entreprise.

### Pourquoi un design "brutalist" ?
Le design neo-brutalist reflète l'authenticité et la transparence de la communauté. Pas de fioritures, juste l'essentiel : des codes qui marchent. C'est brut, efficace, mémorable.

### Est-ce vraiment gratuit ?
Oui ! 100% gratuit pour tous les utilisateurs. Le projet est open-source et axé sur la communauté.

---

## Configuration & Installation

### Comment démarrer ?
1. Ouvrez `QUICKSTART.md` pour le guide rapide
2. Configurez Supabase avec `SUPABASE_SETUP.md`
3. Testez l'application !

### Faut-il un compte Supabase payant ?
Non, le plan gratuit Supabase suffit largement pour commencer. Il offre :
- 500 MB de stockage base de données
- 1 GB de stockage fichiers
- 2 GB de bande passante
- Authentification illimitée

### Puis-je utiliser Firebase à la place ?
Le code est optimisé pour Supabase, mais Firebase nécessiterait des modifications importantes :
- Adapter les requêtes (Firestore vs PostgreSQL)
- Modifier l'authentification
- Revoir les règles de sécurité

### Comment obtenir mes credentials Supabase ?
Ils sont déjà configurés dans `/utils/supabase/info.tsx`. Si vous voulez les changer :
1. Allez sur supabase.com/dashboard
2. Sélectionnez votre projet
3. Settings > API
4. Copiez Project URL et Anon Key

---

## Utilisation

### Comment publier un code ?
1. Connectez-vous (ou créez un compte)
2. Cliquez "+ Nouveau Code"
3. Remplissez tous les champs obligatoires
4. Cliquez "Publier le code"

### Que mettre dans "Discount" ?
Exemples :
- "-50€ la première année"
- "20% de réduction"
- "3 mois gratuits"
- "Frais bancaires offerts"
- "50€ crédités après parrainage"

### Comment modifier un code publié ?
Actuellement, vous ne pouvez que supprimer et republier. La fonction d'édition sera ajoutée dans la v1.1.

### Puis-je supprimer un code ?
Cette fonctionnalité sera ajoutée prochainement. Pour l'instant, contactez l'admin.

### Comment noter un code ?
1. Cliquez sur un code pour voir ses détails
2. Scrollez jusqu'à "Noter ce code"
3. Choisissez 1-5 étoiles
4. Ajoutez un commentaire (optionnel)
5. Cliquez "Soumettre mon avis"

### Puis-je modifier ma note ?
Oui ! Soumettez simplement une nouvelle note sur le même code, elle écrasera l'ancienne.

---

## Problèmes Techniques

### "relation does not exist"
**Cause** : Les tables Supabase n'ont pas été créées.
**Solution** : 
1. Ouvrez `SUPABASE_SETUP.md`
2. Copiez le SQL complet
3. Exécutez-le dans SQL Editor

### "new row violates row-level security"
**Cause** : Les policies RLS ne sont pas configurées.
**Solution** :
```sql
-- Vérifiez les policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```
Si vide, réexécutez le script SQL complet.

### "Failed to fetch" ou erreur réseau
**Causes possibles** :
1. Credentials Supabase incorrects
2. Projet Supabase en pause (inactif 7j)
3. Problème de connexion internet

**Solutions** :
1. Vérifiez `/utils/supabase/info.tsx`
2. Allez sur supabase.com et réveillez le projet
3. Testez votre connexion

### Impossible de s'inscrire
**Cause** : Email confirmation activé.
**Solution** :
1. Supabase Dashboard > Auth Settings
2. Décochez "Enable email confirmations"
3. Sauvegardez

### Les codes ne se chargent pas
**Diagnostic** :
1. Ouvrez la console (F12)
2. Onglet "Console" : cherchez les erreurs rouges
3. Onglet "Network" : vérifiez les requêtes Supabase

**Solutions** :
- Vérifiez que les tables existent
- Testez une requête dans SQL Editor :
```sql
SELECT * FROM codes LIMIT 5;
```

### Erreur "duplicate key value"
**Cause** : Username déjà pris.
**Solution** : Choisissez un autre username unique.

---

## Sécurité & Confidentialité

### Les données sont-elles sécurisées ?
Oui :
- Connexion HTTPS
- Passwords hashés par Supabase
- Row Level Security (RLS) activé
- Aucune donnée sensible stockée

### Qui peut voir mes codes ?
Tous les codes sont publics. C'est le principe d'une plateforme communautaire.

### Qui peut voir mon email ?
Seuls vous et l'admin Supabase. L'email n'est jamais affiché publiquement.

### Puis-je supprimer mon compte ?
Oui. Actuellement, contactez l'admin. La fonction sera ajoutée dans une future version.

### Les codes sont-ils vérifiés ?
Les codes sont soumis par la communauté. Le système de notation permet de valider leur efficacité. Les codes avec de mauvaises notes peuvent être supprimés.

---

## Fonctionnalités

### Pourquoi ne puis-je pas upvote/downvote ?
Cette fonctionnalité sera ajoutée dans la v1.1. Pour l'instant, utilisez le système de notation (étoiles).

### Y a-t-il des notifications ?
Pas encore. Les notifications email pour nouveaux codes seront ajoutées dans la v1.1.

### Puis-je exporter les codes ?
Pas via l'interface, mais vous pouvez :
```sql
-- Dans Supabase SQL Editor
COPY (SELECT * FROM codes WHERE category = 'FINANCE') 
TO '/tmp/codes_finance.csv' CSV HEADER;
```

### Y a-t-il une API ?
Pas encore. L'API publique est prévue pour la v1.2.

### Existe-t-il une extension navigateur ?
Pas encore. Prévu pour la v1.2.

---

## Performance

### L'application est lente
**Causes possibles** :
1. Beaucoup de codes (>1000) : indexes aident
2. Connexion lente
3. Plan Supabase gratuit (limites)

**Solutions** :
1. Les indexes sont déjà créés
2. Testez votre connexion
3. Passez au plan Pro Supabase si nécessaire

### Combien de codes peut gérer la plateforme ?
Avec le plan gratuit Supabase : environ 5000-10000 codes sans problème.
Avec indexes optimisés : 100000+ codes.

---

## Déploiement

### Comment déployer en production ?
Consultez `DEPLOYMENT.md` pour le guide complet.

En résumé :
1. Réactivez l'email confirmation
2. Configurez SMTP pour emails
3. Ajoutez un domaine personnalisé
4. Configurez les CORS

### Quel nom de domaine choisir ?
Recommandations :
1. **CodeEntreprise.fr** (SEO: 95/100)
2. **PromoStartup.com** (SEO: 88/100)
3. **ParrainPro.fr** (SEO: 82/100)

### Où héberger ?
L'application est déjà dans Figma Make. Pour la déployer ailleurs :
- **Vercel** : Idéal pour React (gratuit)
- **Netlify** : Alternative similaire (gratuit)
- **Supabase Hosting** : Bientôt disponible

### Faut-il configurer un serveur ?
Non ! C'est une application "serverless" :
- Frontend : Figma Make / Vercel / Netlify
- Backend : Supabase (géré pour vous)

---

## Contributions & Communauté

### Puis-je contribuer au code ?
Oui ! Le projet est open-source. Proposez vos améliorations.

### Comment signaler un bug ?
1. Vérifiez qu'il n'est pas déjà connu
2. Ouvrez une issue GitHub
3. Décrivez : étapes, erreur, capture d'écran

### Comment proposer une fonctionnalité ?
1. Vérifiez la roadmap dans `QUICKSTART.md`
2. Si pas listée, proposez-la
3. Expliquez le cas d'usage

### Puis-je forker le projet ?
Oui ! License MIT. Vous pouvez :
- Forker et modifier
- Créer votre propre version
- L'utiliser commercialement

Merci de créditer le projet original.

---

## Business & Monétisation

### Comment monétiser la plateforme ?
Idées :
1. **Affiliation** : Commission sur codes utilisés
2. **Premium** : Codes exclusifs payants
3. **Partenariats** : Sponsoring fournisseurs
4. **API** : Accès payant aux données
5. **Publicité** : Annonces ciblées

### Puis-je vendre des codes ?
Oui, mais ajoutez une fonctionnalité de paiement (Stripe, PayPal).

### Y a-t-il des restrictions légales ?
Vérifiez :
- CGU des fournisseurs (certains interdisent le partage public)
- RGPD pour données utilisateurs
- Mentions légales obligatoires (France)

---

## Support

### Où trouver de l'aide ?
1. **Documentation** : README.md, DEPLOYMENT.md
2. **Supabase Docs** : supabase.com/docs
3. **React Docs** : react.dev

### Comment contacter le support ?
- Email : contact@codeshare.fr (à configurer)
- GitHub Issues : [Lien à ajouter]

### Y a-t-il une communauté Discord/Slack ?
Pas encore. À créer si la plateforme décolle !

---

## Divers

### Pourquoi "CODE//SHARE" avec "//" ?
Le double slash évoque :
- Le code informatique (commentaires //)
- La modernité
- Le partage (share)
C'est aussi mémorable et recherchable.

### Qui a créé cette plateforme ?
Projet créé pour aider les entrepreneurs à économiser sur leurs outils de création d'entreprise.

### Quelle est la vision long-terme ?
Devenir LA référence francophone pour les codes promo entrepreneurs, avec :
- Des milliers de codes validés
- Une communauté active
- Des partenariats exclusifs
- Des outils complémentaires (API, extension, app mobile)

---

**Autre question ?** Ouvrez une issue ou consultez la documentation complète.

🔥 **CODE//SHARE** - Brutal. Simple. Efficace.
