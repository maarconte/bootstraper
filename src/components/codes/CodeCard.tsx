import React, { useState } from 'react';
import { Copy, Eye, ThumbsUp, Calendar, User, ExternalLink, Star } from 'lucide-react';
import { Code } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate, isExpired, getDaysUntilExpiry, copyToClipboard } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface CodeCardProps {
  code: Code;
  onCopy?: () => void;
}

export const CodeCard: React.FC<CodeCardProps> = ({ code, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const expired = isExpired(code.expiry_date);
  const daysUntilExpiry = getDaysUntilExpiry(code.expiry_date);

  const handleCopy = async () => {
    const success = await copyToClipboard(code.code);
    if (success) {
      setCopied(true);
      
      // Incrémenter le compteur de copies
      await supabase
        .from('codes')
        .update({ copies: (code.copies || 0) + 1 })
        .eq('id', code.id);

      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    }
  };

  const handleView = async () => {
    // Incrémenter le compteur de vues
    await supabase
      .from('codes')
      .update({ views: (code.views || 0) + 1 })
      .eq('id', code.id);
  };

  return (
    <div className="brutal-border bg-white brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all animate-brutal-slide">
      {/* Header avec catégorie */}
      <div className="border-b-4 border-black p-4 bg-brutal-purple-light">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge variant="category" category={code.category}>
              {code.category}
            </Badge>
            <h3 className="font-mono font-bold text-xl mt-2 uppercase">
              {code.title}
            </h3>
            <p className="font-mono text-sm mt-1 text-gray-700">
              {code.provider}
            </p>
          </div>
          
          {/* Rating */}
          {code.rating_count && code.rating_count > 0 && (
            <div className="flex items-center space-x-1 brutal-border bg-brutal-yellow px-2 py-1">
              <Star className="w-4 h-4 fill-black" />
              <span className="font-mono font-bold text-sm">
                {code.average_rating?.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <p className="font-mono text-sm leading-relaxed">
          {code.description}
        </p>

        {/* Discount */}
        <div className="brutal-border bg-brutal-yellow p-3">
          <p className="font-mono font-bold text-lg uppercase text-center">
            {code.discount}
          </p>
        </div>

        {/* Code */}
        <div className="brutal-border bg-white p-3 flex items-center justify-between">
          <code className="font-mono font-bold text-lg flex-1 break-all">
            {code.code}
          </code>
          <button
            onClick={handleCopy}
            className="ml-3 brutal-border bg-brutal-purple text-white p-2 hover:bg-black transition-all"
            title="Copier le code"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {copied && (
          <p className="font-mono text-sm text-center text-brutal-purple font-bold animate-brutal-pop">
            ✓ CODE COPIÉ !
          </p>
        )}

        {/* Expiration */}
        {code.expiry_date && (
          <div className="flex items-center space-x-2 text-sm font-mono">
            <Calendar className="w-4 h-4" />
            <span className={expired ? 'text-red-600 font-bold' : ''}>
              {expired ? 'EXPIRÉ' : `Expire le ${formatDate(code.expiry_date)}`}
              {!expired && daysUntilExpiry && daysUntilExpiry <= 7 && (
                <span className="text-brutal-yellow font-bold ml-2">
                  ({daysUntilExpiry}j restants)
                </span>
              )}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t-4 border-black">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="font-mono font-bold">{code.views || 0}</span>
            </div>
            <span className="font-mono text-xs uppercase">Vues</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Copy className="w-4 h-4" />
              <span className="font-mono font-bold">{code.copies || 0}</span>
            </div>
            <span className="font-mono text-xs uppercase">Copies</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span className="font-mono font-bold">{code.confirmations || 0}</span>
            </div>
            <span className="font-mono text-xs uppercase">Validés</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-black p-4 bg-brutal-cream flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-mono">
          <User className="w-4 h-4" />
          <span>Par {code.user?.username || 'Anonyme'}</span>
        </div>
        <Link to={`/code/${code.id}`} onClick={handleView}>
          <Button variant="outline" size="sm">
            Détails
            <ExternalLink className="w-4 h-4 ml-1 inline" />
          </Button>
        </Link>
      </div>
    </div>
  );
};