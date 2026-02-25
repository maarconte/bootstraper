import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isExpired = (expiryDate: string | null) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

export const getDaysUntilExpiry = (expiryDate: string | null) => {
  if (!expiryDate) return null;
  const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return days;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    FINANCE: 'bg-brutal-purple text-white',
    SAAS: 'bg-brutal-teal text-white',
    HOSTING: 'bg-brutal-yellow text-black',
    ACCOUNTING: 'bg-brutal-purple-light text-black',
    LEGAL: 'bg-brutal-yellow text-black',
    MARKETING: 'bg-brutal-teal text-white',
    SERVICES: 'bg-brutal-purple-dark text-white',
    OTHER: 'bg-white text-black',
  };
  return colors[category] || colors.OTHER;
};