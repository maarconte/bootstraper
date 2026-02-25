import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Code, Rating, Profile, UserStats } from '../types';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-5855fea6`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ==================== CODES API ====================

export const fetchCodes = async (params: {
  category?: string;
  search?: string;
  sortBy?: string;
  showExpired?: boolean;
}): Promise<Code[]> => {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.showExpired !== undefined) queryParams.append('showExpired', String(params.showExpired));

  const response = await fetch(`${API_BASE}/codes?${queryParams}`, { headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to fetch codes');
  }
  return response.json();
};

export const fetchCode = async (id: string): Promise<Code> => {
  const response = await fetch(`${API_BASE}/codes/${id}`, { headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to fetch code');
  }
  return response.json();
};

export const createCode = async (codeData: {
  title: string;
  description: string;
  code: string;
  category: string;
  provider: string;
  discount: string;
  expiry_date: string | null;
  user_id: string;
}): Promise<Code> => {
  const response = await fetch(`${API_BASE}/codes`, {
    method: 'POST',
    headers,
    body: JSON.stringify(codeData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to create code');
  }
  return response.json();
};

export const incrementCodeViews = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/codes/${id}/view`, {
    method: 'POST',
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to increment views');
  }
};

export const incrementCodeCopies = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/codes/${id}/copy`, {
    method: 'POST',
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to increment copies');
  }
};

export const incrementCodeConfirmations = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/codes/${id}/confirm`, {
    method: 'POST',
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to increment confirmations');
  }
};

// ==================== RATINGS API ====================

export const fetchRatings = async (codeId: string): Promise<Rating[]> => {
  const response = await fetch(`${API_BASE}/ratings/${codeId}`, { headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to fetch ratings');
  }
  return response.json();
};

export const createRating = async (ratingData: {
  code_id: string;
  user_id: string;
  rating: number;
  comment?: string;
}): Promise<Rating> => {
  const response = await fetch(`${API_BASE}/ratings`, {
    method: 'POST',
    headers,
    body: JSON.stringify(ratingData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to create rating');
  }
  return response.json();
};

// ==================== PROFILES API ====================

export const fetchProfile = async (userId: string): Promise<Profile> => {
  const response = await fetch(`${API_BASE}/profiles/${userId}`, { headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to fetch profile');
  }
  return response.json();
};

export const createOrUpdateProfile = async (profileData: {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
}): Promise<Profile> => {
  const response = await fetch(`${API_BASE}/profiles`, {
    method: 'POST',
    headers,
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to create/update profile');
  }
  return response.json();
};

export const fetchUserStats = async (userId: string): Promise<UserStats> => {
  const response = await fetch(`${API_BASE}/stats/${userId}`, { headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to fetch stats');
  }
  return response.json();
};
