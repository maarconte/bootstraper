import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Code, Rating, Profile, UserStats, FilterState } from '../types';
import * as api from './api';

// Hook pour récupérer les codes avec filtres
export const useCodes = (filters: FilterState) => {
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCodes();
  }, [filters]);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const data = await api.fetchCodes({
        category: filters.category !== 'ALL' ? filters.category : undefined,
        search: filters.search || undefined,
        sortBy: filters.sortBy,
        showExpired: filters.showExpired,
      });

      setCodes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des codes');
      console.error('Error fetching codes:', err);
    } finally {
      setLoading(false);
    }
  };

  return { codes, loading, error, refetch: fetchCodes };
};

// Hook pour un code spécifique
export const useCode = (id: string) => {
  const [code, setCode] = useState<Code | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchCode();
  }, [id]);

  const fetchCode = async () => {
    try {
      setLoading(true);
      const data = await api.fetchCode(id);
      setCode(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du code');
      console.error('Error fetching code:', err);
    } finally {
      setLoading(false);
    }
  };

  return { code, loading, error, refetch: fetchCode };
};

// Hook pour les ratings d'un code
export const useRatings = (codeId: string) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (codeId) fetchRatings();
  }, [codeId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const data = await api.fetchRatings(codeId);
      setRatings(data);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  return { ratings, loading, refetch: fetchRatings };
};

// Hook pour les stats utilisateur
export const useUserStats = (userId: string) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.fetchUserStats(userId);
      setStats(data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
};
