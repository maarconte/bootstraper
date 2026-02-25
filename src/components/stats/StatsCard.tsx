import React from 'react';
import { TrendingUp, Eye, Copy, ThumbsUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: 'views' | 'copies' | 'confirmations' | 'codes';
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color = 'var(--brutal-orange)' }) => {
  const icons = {
    views: Eye,
    copies: Copy,
    confirmations: ThumbsUp,
    codes: TrendingUp,
  };

  const Icon = icons[icon];

  return (
    <div className="brutal-border bg-white brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
      <div className="border-b-4 border-black p-4" style={{ backgroundColor: color }}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="p-6">
        <p className="font-mono text-4xl font-bold mb-2">{value}</p>
        <p className="font-mono uppercase font-bold text-sm">{title}</p>
      </div>
    </div>
  );
};
