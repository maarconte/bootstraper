// Types TypeScript pour l'application

export interface Code {
  id: string;
  title: string;
  description: string;
  code: string;
  category: Category;
  provider: string;
  discount: string;
  expiry_date: string | null;
  user_id: string;
  views: number;
  copies: number;
  confirmations: number;
  created_at: string;
  user?: Profile;
  average_rating?: number;
  rating_count?: number;
}

export type Category = 
  | 'FINANCE'
  | 'SAAS'
  | 'HOSTING'
  | 'ACCOUNTING'
  | 'LEGAL'
  | 'MARKETING'
  | 'SERVICES'
  | 'OTHER';

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'FINANCE', label: 'Banques & Finance' },
  { value: 'SAAS', label: 'Outils SaaS' },
  { value: 'HOSTING', label: 'Hébergement' },
  { value: 'ACCOUNTING', label: 'Comptabilité' },
  { value: 'LEGAL', label: 'Juridique' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'OTHER', label: 'Autre' },
];

export interface Rating {
  id: string;
  code_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: Profile;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface UserStats {
  total_codes: number;
  total_views: number;
  total_copies: number;
  total_confirmations: number;
}

export type SortBy = 'recent' | 'popular' | 'expiring' | 'top-rated';

export interface FilterState {
  category: Category | 'ALL';
  search: string;
  sortBy: SortBy;
  showExpired: boolean;
}
