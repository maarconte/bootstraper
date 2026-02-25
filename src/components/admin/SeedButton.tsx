import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { Button } from '../ui/button';
import { createCode } from '../../lib/api';

const DUMMY_CODES = [
  {
    title: 'Stripe',
    description: '50 000€ sans frais de traitement sur vos premiers encaissements',
    code: 'STARTUP50',
    category: 'FINANCE',
    provider: 'Stripe',
    discount: '50 000€ offerts',
    expiry_date: '2026-12-31',
    user_id: 'system',
  },
  {
    title: 'Qonto',
    description: '3 mois offerts sur tous les forfaits pro pour les créateurs',
    code: 'QONTOXCODE',
    category: 'FINANCE',
    provider: 'Qonto',
    discount: '3 mois gratuits',
    expiry_date: null,
    user_id: 'system',
  },
  {
    title: 'AWS',
    description: '100 000$ de crédits cloud pour les startups via AWS Activate',
    code: 'AWSSTART25',
    category: 'HOSTING',
    provider: 'Amazon Web Services',
    discount: '100k$ crédits',
    expiry_date: '2026-06-30',
    user_id: 'system',
  }
];

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    if (!confirm('Voulez-vous initialiser Firebase avec des codes de démonstration ?')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      for (const c of DUMMY_CODES) {
        await createCode(c);
      }
      setMessage('✓ Firebase initialisé avec succès ! Rechargez la page.');
    } catch (error) {
      console.error('Error seeding database:', error);
      setMessage('❌ Erreur lors de l\'initialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brutal-border bg-brutal-cream brutal-shadow p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono font-bold text-lg uppercase mb-2">
            Initialiser les données de démonstration
          </h3>
          <p className="font-mono text-sm">
            Aucun code trouvé ? Cliquez ici pour ajouter des exemples de codes promotionnels.
          </p>
        </div>
        <Button
          onClick={handleSeed}
          disabled={loading}
          variant="primary"
        >
          <Database className="w-5 h-5 mr-2" />
          {loading ? 'Initialisation...' : 'Initialiser'}
        </Button>
      </div>
      {message && (
        <div className="mt-4 font-mono font-bold">
          {message}
        </div>
      )}
    </div>
  );
};
