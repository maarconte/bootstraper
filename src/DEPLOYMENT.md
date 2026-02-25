# GUIDE DE DÉPLOIEMENT - CODE//SHARE

## 🎯 Prérequis

- Compte Firebase (gratuit)
- Navigateur moderne

## 📋 Étapes de Configuration

### 1. Configuration Firebase (15 min)

#### A. Créer le projet
1. Allez sur [firebase.com](https://firebase.com)
2. Cliquez sur "New Project"
3. Remplissez :
   - **Name**: codeshare
   - **Database Password**: [Générez un mot de passe fort]
   - **Region**: West EU (Frankfurt) - pour la France
4. Cliquez "Create new project" (attendre 2-3 min)

#### B. Récupérer les credentials
1. Dans votre projet, allez dans **Settings** > **API**
2. Notez :
   - **Project URL**: `https://xxxxx.firebase.co`
   - **Anon/Public Key**: `eyJhbG...`
3. Ces valeurs sont déjà configurées dans Figma Make

#### C. Créer les tables
1. Allez dans **SQL Editor**
2. Cliquez "New query"
3. Copiez le contenu complet de `/firebase-schema.sql`
4. Cliquez "Run" (en bas à droite)
5. Vérifiez les messages de succès

#### D. Vérifier les tables
1. Allez dans **Table Editor**
2. Vous devriez voir :
   - ✅ profiles
   - ✅ codes
   - ✅ ratings
3. Si elles n'apparaissent pas, rafraîchissez la page

#### E. Configurer l'authentification
1. Allez dans **Authentication** > **Providers**
2. **Email** devrait être activé par défaut
3. Pour les tests, désactivez temporairement :
   - **Settings** > **Auth** > Décochez "Enable email confirmations"
   - ⚠️ À réactiver en production !

#### F. Configurer les Storage Buckets (optionnel)
Si vous voulez ajouter des avatars plus tard :
1. Allez dans **Storage**
2. Créez un bucket "avatars"
3. Définissez-le comme public

### 2. Tester l'Application (5 min)

#### A. Première visite
1. Cliquez sur "Preview" dans Figma Make
2. Vous devriez voir la page d'accueil brutalist

#### B. Créer un compte
1. Cliquez "Connexion" puis "S'inscrire"
2. Remplissez :
   - Username: entrepreneur1
   - Email: test@example.com
   - Password: Test123456!
3. Vous devriez être redirigé vers l'accueil, connecté

#### C. Soumettre un code
1. Cliquez "+ Nouveau Code"
2. Remplissez le formulaire :
   ```
   Titre: Compte pro Shine -50€
   Fournisseur: Shine
   Description: Ouvrez votre compte bancaire professionnel...
   Code promo: STARTUP2024
   Réduction: -50€ la première année
   Catégorie: Banques & Finance
   Date d'expiration: 2024-12-31
   ```
3. Cliquez "Publier le code"
4. Vous devriez voir votre code dans la liste

#### D. Tester les fonctionnalités
- ✅ Copier le code
- ✅ Filtrer par catégorie
- ✅ Rechercher
- ✅ Noter le code
- ✅ Voir les stats
- ✅ Consulter le profil

### 3. Résolution des Problèmes Courants

#### Erreur "Failed to fetch"
**Cause**: Credentials Firebase incorrects
**Solution**: 
1. Vérifiez dans `/utils/firebase/info.tsx`
2. Comparez avec Settings > API dans Firebase
3. Rechargez l'application

#### Erreur "relation does not exist"
**Cause**: Tables non créées
**Solution**:
1. Retournez dans SQL Editor
2. Réexécutez le script `/firebase-schema.sql`
3. Vérifiez qu'aucune erreur n'apparaît

#### Erreur "row-level security policy"
**Cause**: RLS mal configuré
**Solution**:
1. Dans SQL Editor, exécutez :
```sql
-- Vérifier RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```
2. Toutes les tables devraient avoir `rowsecurity = true`

#### Erreur lors de l'inscription
**Cause**: Email confirmation activé
**Solution**:
1. Settings > Auth
2. Décochez "Enable email confirmations"
3. Sauvegardez

#### Les codes ne s'affichent pas
**Cause**: Problème de requête ou permissions
**Solution**:
1. Ouvrez la console (F12)
2. Vérifiez les erreurs réseau
3. Testez la requête dans Firebase:
```sql
SELECT * FROM codes;
```

### 4. Configuration Production

#### A. Sécuriser Firebase
1. **Réactiver email confirmation**:
   - Settings > Auth > ✅ Enable email confirmations
   
2. **Configurer SMTP** (pour les emails):
   - Settings > Auth > SMTP Settings
   - Utilisez SendGrid, Mailgun, ou autre
   
3. **Rate limiting**:
   - Settings > Auth > Rate Limits
   - Configurez selon vos besoins

#### B. Variables d'environnement
Mettez à jour `/utils/firebase/info.tsx` avec vos vrais credentials:
```typescript
export const projectId = 'VOTRE_PROJECT_ID';
export const publicAnonKey = 'VOTRE_ANON_KEY';
```

#### C. Domaine personnalisé
1. Achetez votre domaine (CodeEntreprise.fr recommandé)
2. Dans Figma Make, configurez le domaine custom
3. Mettez à jour les CORS dans Firebase:
   - Settings > API > CORS
   - Ajoutez votre domaine

#### D. Analytics (optionnel)
Ajoutez Google Analytics dans `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 5. Backup et Maintenance

#### Backup automatique Firebase
1. Settings > Database > Point-in-time Recovery
2. Activé par défaut sur plan Pro
3. Permet de restaurer jusqu'à 7 jours en arrière

#### Exporter les données
```sql
-- Exporter tous les codes
COPY (SELECT * FROM codes) TO '/tmp/codes.csv' CSV HEADER;

-- Exporter tous les profils
COPY (SELECT * FROM profiles) TO '/tmp/profiles.csv' CSV HEADER;
```

#### Monitoring
1. Dashboard Firebase montre :
   - Nombre de requêtes
   - Temps de réponse
   - Erreurs
2. Configurez des alertes si dépassement

### 6. Prochaines Étapes

#### Contenu initial
1. Créez 10-20 codes de qualité
2. Variez les catégories
3. Ajoutez des descriptions détaillées

#### Marketing
1. Postez sur ProductHunt
2. Partagez sur LinkedIn/Twitter
3. Contactez des communautés d'entrepreneurs

#### Community Building
1. Modérez les codes régulièrement
2. Répondez aux utilisateurs
3. Ajoutez de nouvelles fonctionnalités selon feedback

## 📞 Support

En cas de problème :
1. Vérifiez la console navigateur (F12)
2. Consultez les logs Firebase (Logs Explorer)
3. Relisez ce guide de A à Z

## ✅ Checklist de Lancement

- [ ] Projet Firebase créé
- [ ] Tables créées et vérifiées
- [ ] RLS configuré et testé
- [ ] Auth configuré (email)
- [ ] Credentials dans l'app
- [ ] Test inscription/connexion
- [ ] Test création de code
- [ ] Test filtres et recherche
- [ ] Test notation
- [ ] Contenu initial ajouté
- [ ] Analytics installé (optionnel)
- [ ] Domaine configuré (optionnel)
- [ ] Email confirmation activé (production)

---

🚀 **Vous êtes prêt à lancer CODE//SHARE !**
