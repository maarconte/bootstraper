import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, TrendingUp } from 'lucide-react';
import { useUserStats } from '../../lib/hooks';
import { useAuthStore } from '../../store/authStore';
import { Container } from '../layout/Container';
import { StatsCard } from '../stats/StatsCard';
import { CodeGrid } from '../codes/CodeGrid';
import { Button } from '../ui/Button';
import * as api from '../../lib/api';
import { Code } from '../../types';

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const authLoading = !useAuthStore(s => s.isReady);
  const { stats, loading: statsLoading } = useUserStats(user?.uid || '');
  const [userCodes, setUserCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    if (user) {
      fetchUserCodes();
    }
  }, [user, authLoading, navigate]);

  const fetchUserCodes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Récupérer tous les codes et filtrer par user_id côté client
      const allCodes = await api.fetchCodes({});
      const userFilteredCodes = allCodes.filter(code => code.user_id === user.uid);

      // Trier par date de création décroissante
      userFilteredCodes.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setUserCodes(userFilteredCodes);
    } catch (err) {
      console.error('Error fetching user codes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Container>
        <div className="brutal-border bg-[#E5E5E5] h-96 animate-pulse" />
      </Container>
    );
  }

  return (
    <Container>
      {/* Profile Header */}
      <div className="brutal-border bg-white brutal-shadow mb-8">
        <div className="border-b-4 border-black p-6 bg-[#FF6B00]">
          <div className="flex items-center space-x-4">
            <div className="brutal-border bg-black text-white p-4">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-3xl uppercase">
                {user.user_metadata?.username || user.email}
              </h1>
              <p className="font-mono text-sm mt-1">
                Membre depuis{' '}
                {new Date(user.created_at || '').toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="font-mono">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>

      {/* Stats */}
      {!statsLoading && stats && (
        <div>
          <h2 className="font-mono font-bold text-2xl uppercase mb-6">
            Mes statistiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatsCard
              title="Codes publiés"
              value={stats.total_codes}
              icon="codes"
              color="#FF6B00"
            />
            <StatsCard
              title="Vues totales"
              value={stats.total_views}
              icon="views"
              color="#00FF00"
            />
            <StatsCard
              title="Copies totales"
              value={stats.total_copies}
              icon="copies"
              color="#FF00FF"
            />
            <StatsCard
              title="Validations"
              value={stats.total_confirmations}
              icon="confirmations"
              color="#00FFFF"
            />
          </div>
        </div>
      )}

      {/* User Codes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono font-bold text-2xl uppercase">
            Mes codes ({userCodes.length})
          </h2>
          <Button variant="primary" onClick={() => navigate('/submit')}>
            + Nouveau code
          </Button>
        </div>
        <CodeGrid codes={userCodes} loading={loading} />
      </div>
    </Container>
  );
};
