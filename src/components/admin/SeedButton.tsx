import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { Button } from '../ui/Button';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    if (!confirm('Voulez-vous initialiser la base de données avec des codes de démonstration ?')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5855fea6/seed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to seed database');
      }

      const result = await response.json();
      setMessage('✓ Base de données initialisée avec succès ! Rechargez la page.');
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
