import * as kv from "./kv_store.tsx";

// Fonction pour initialiser la base de données avec des données de démonstration
export async function seedDatabase() {
  console.log("Starting database seeding...");

  // Créer un utilisateur de démonstration
  const demoUserId = "demo-user-123";
  const demoProfile = {
    id: demoUserId,
    username: "CodeMaster",
    email: "demo@codeshare.com",
    avatar_url: null,
    created_at: new Date("2025-01-01").toISOString(),
  };

  await kv.set(`profile:${demoUserId}`, demoProfile);
  console.log("Created demo profile");

  // Créer des codes de démonstration
  const demoCodes = [
    {
      id: "code-1",
      title: "Shine - Compte pro gratuit pendant 3 mois",
      description: "Ouvrez votre compte professionnel Shine et profitez de 3 mois gratuits sur l'offre Premium. Idéal pour les entrepreneurs qui démarrent leur activité.",
      code: "STARTUP2025",
      category: "FINANCE",
      provider: "Shine",
      discount: "3 mois gratuits",
      expiry_date: new Date("2025-12-31").toISOString(),
      user_id: demoUserId,
      views: 234,
      copies: 89,
      confirmations: 67,
      created_at: new Date("2025-02-01").toISOString(),
    },
    {
      id: "code-2",
      title: "Notion - 50% de réduction pendant 6 mois",
      description: "Profitez de 50% de réduction sur Notion Plus pendant 6 mois. Parfait pour organiser votre startup et vos projets.",
      code: "NOTION50",
      category: "SAAS",
      provider: "Notion",
      discount: "50% pendant 6 mois",
      expiry_date: new Date("2025-06-30").toISOString(),
      user_id: demoUserId,
      views: 512,
      copies: 203,
      confirmations: 178,
      created_at: new Date("2025-01-15").toISOString(),
    },
    {
      id: "code-3",
      title: "OVH - 100€ de crédit cloud gratuit",
      description: "Démarrez sur OVH Cloud avec 100€ de crédit gratuit. Valable sur tous les services cloud (VPS, serveurs dédiés, etc.).",
      code: "CLOUDSTART100",
      category: "HOSTING",
      provider: "OVH",
      discount: "100€ de crédit",
      expiry_date: null,
      user_id: demoUserId,
      views: 387,
      copies: 156,
      confirmations: 134,
      created_at: new Date("2025-01-20").toISOString(),
    },
    {
      id: "code-4",
      title: "Qonto - Compte pro + carte gratuite",
      description: "Ouvrez votre compte Qonto et recevez votre première carte bancaire gratuitement. Code de parrainage exclusif.",
      code: "QONTOSTART",
      category: "FINANCE",
      provider: "Qonto",
      discount: "Carte gratuite",
      expiry_date: new Date("2025-08-31").toISOString(),
      user_id: demoUserId,
      views: 445,
      copies: 178,
      confirmations: 145,
      created_at: new Date("2025-01-25").toISOString(),
    },
    {
      id: "code-5",
      title: "Indy - Comptabilité gratuite 1 an",
      description: "Gérez votre comptabilité gratuitement pendant 1 an avec Indy (ex-Georges). Factures, devis, déclarations fiscales automatiques.",
      code: "INDY2025FREE",
      category: "ACCOUNTING",
      provider: "Indy",
      discount: "1 an gratuit",
      expiry_date: new Date("2025-12-31").toISOString(),
      user_id: demoUserId,
      views: 298,
      copies: 121,
      confirmations: 98,
      created_at: new Date("2025-02-05").toISOString(),
    },
    {
      id: "code-6",
      title: "LegalPlace - 30% sur création entreprise",
      description: "Créez votre entreprise avec LegalPlace et bénéficiez de 30% de réduction. SASU, SAS, EURL, statuts juridiques.",
      code: "LEGAL30",
      category: "LEGAL",
      provider: "LegalPlace",
      discount: "30% de réduction",
      expiry_date: new Date("2025-05-31").toISOString(),
      user_id: demoUserId,
      views: 276,
      copies: 98,
      confirmations: 76,
      created_at: new Date("2025-02-08").toISOString(),
    },
    {
      id: "code-7",
      title: "Canva Pro - 45 jours gratuits",
      description: "Testez Canva Pro gratuitement pendant 45 jours. Accédez à tous les templates premium et outils de design.",
      code: "CANVAPRO45",
      category: "MARKETING",
      provider: "Canva",
      discount: "45 jours gratuits",
      expiry_date: null,
      user_id: demoUserId,
      views: 623,
      copies: 287,
      confirmations: 234,
      created_at: new Date("2025-02-10").toISOString(),
    },
    {
      id: "code-8",
      title: "Hostinger - 75% de réduction hébergement web",
      description: "Hébergez votre site web avec Hostinger à -75%. Inclus: domaine gratuit, SSL, emails professionnels.",
      code: "HOST75OFF",
      category: "HOSTING",
      provider: "Hostinger",
      discount: "75% de réduction",
      expiry_date: new Date("2025-04-30").toISOString(),
      user_id: demoUserId,
      views: 198,
      copies: 87,
      confirmations: 71,
      created_at: new Date("2025-02-11").toISOString(),
    },
  ];

  for (const code of demoCodes) {
    await kv.set(`code:${code.id}`, code);
  }
  console.log(`Created ${demoCodes.length} demo codes`);

  // Créer quelques ratings de démonstration
  const demoRatings = [
    {
      id: "rating-1",
      code_id: "code-1",
      user_id: demoUserId,
      rating: 5,
      comment: "Super code ! Fonctionne parfaitement, j'ai pu ouvrir mon compte pro gratuitement.",
      created_at: new Date("2025-02-03").toISOString(),
    },
    {
      id: "rating-2",
      code_id: "code-2",
      user_id: demoUserId,
      rating: 5,
      comment: "Excellent deal pour Notion. Le code a été accepté immédiatement !",
      created_at: new Date("2025-01-18").toISOString(),
    },
    {
      id: "rating-3",
      code_id: "code-3",
      user_id: demoUserId,
      rating: 4,
      comment: "Code valide, les 100€ de crédit ont bien été crédités sur mon compte OVH.",
      created_at: new Date("2025-01-22").toISOString(),
    },
    {
      id: "rating-4",
      code_id: "code-7",
      user_id: demoUserId,
      rating: 5,
      comment: "Parfait pour tester Canva Pro ! 45 jours c'est généreux.",
      created_at: new Date("2025-02-11").toISOString(),
    },
  ];

  for (const rating of demoRatings) {
    await kv.set(`rating:${rating.code_id}:${rating.user_id}`, rating);
  }
  console.log(`Created ${demoRatings.length} demo ratings`);

  console.log("Database seeding completed!");
  return { success: true, message: "Database seeded successfully" };
}
