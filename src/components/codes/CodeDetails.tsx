import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Copy,
  Eye,
  ThumbsUp,
  Calendar,
  User,
  Star,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { useCode, useRatings } from '../../lib/hooks';
import { useAuthStore } from '../../store/authStore';
import { Container } from '../layout/Container';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TextArea } from '../ui/form-components';
import { formatDate, isExpired, copyToClipboard } from '../../lib/utils';
import * as api from '../../lib/api';

export const CodeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const { code, loading, refetch } = useCode(id || '');
  const { ratings, refetch: refetchRatings } = useRatings(id || '');

  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  if (loading) {
    return (
      <Container>
        <div className="brutal-border bg-[#E5E5E5] h-96 animate-pulse" />
      </Container>
    );
  }

  if (!code) {
    return (
      <Container>
        <div className="brutal-border bg-white p-12 text-center">
          <h2 className="font-mono font-bold text-2xl uppercase mb-4">
            Code introuvable
          </h2>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </Container>
    );
  }

  const expired = isExpired(code.expiry_date);

  const handleCopy = async () => {
    const success = await copyToClipboard(code.code);
    if (success) {
      setCopied(true);
      await api.incrementCodeCopies(code.id);
      refetch();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Vous devez être connecté pour noter un code');
      return;
    }

    setSubmittingRating(true);
    try {
      await api.createRating({
        code_id: code.id,
        user_id: user.uid,
        rating,
        comment: comment || undefined,
      });

      setComment('');
      refetchRatings();
      refetch();
    } catch (err) {
      console.error('Error submitting rating:', err);
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <Container>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Code Card */}
          <div className="brutal-border bg-white brutal-shadow">
            {/* Header */}
            <div className="border-b-4 border-black p-6 bg-[#E5E5E5]">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="category" category={code.category}>
                  {code.category}
                </Badge>
                {code.rating_count && code.rating_count > 0 && (
                  <div className="flex items-center space-x-2 brutal-border bg-[#FF6B00] px-3 py-2">
                    <Star className="w-5 h-5 fill-black" />
                    <span className="font-mono font-bold text-lg">
                      {code.average_rating?.toFixed(1)}
                    </span>
                    <span className="font-mono text-sm">
                      ({code.rating_count} avis)
                    </span>
                  </div>
                )}
              </div>
              <h1 className="font-mono font-bold text-3xl uppercase mb-2">
                {code.title}
              </h1>
              <p className="font-mono text-lg">{code.provider}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-mono font-bold uppercase mb-2">Description</h3>
                <p className="font-mono leading-relaxed">{code.description}</p>
              </div>

              <div className="brutal-border bg-[#FF6B00] p-4">
                <p className="font-mono font-bold text-2xl uppercase text-center">
                  {code.discount}
                </p>
              </div>

              <div className="brutal-border bg-white p-4 flex items-center justify-between">
                <code className="font-mono font-bold text-2xl flex-1">
                  {code.code}
                </code>
                <button
                  onClick={handleCopy}
                  className="ml-4 brutal-border bg-black text-white p-3 hover:bg-[#FF6B00] hover:text-black transition-all"
                >
                  <Copy className="w-6 h-6" />
                </button>
              </div>

              {copied && (
                <p className="font-mono text-center text-[#FF6B00] font-bold text-lg animate-brutal-pop">
                  ✓ CODE COPIÉ !
                </p>
              )}

              {code.expiry_date && (
                <div className="flex items-center space-x-2 font-mono">
                  <Calendar className="w-5 h-5" />
                  <span className={expired ? 'text-red-600 font-bold' : ''}>
                    {expired ? 'EXPIRÉ' : `Expire le ${formatDate(code.expiry_date)}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rating Form */}
          {user && (
            <div className="brutal-border bg-white brutal-shadow">
              <div className="border-b-4 border-black p-4 bg-[#FF6B00]">
                <h3 className="font-mono font-bold text-xl uppercase">Noter ce code</h3>
              </div>
              <form onSubmit={handleSubmitRating} className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 font-mono font-bold uppercase text-sm">
                    Votre note (1-5 étoiles)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="brutal-border p-3 hover:bg-[#FF6B00] transition-all"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-black' : ''
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <TextArea
                  label="Commentaire (optionnel)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce code..."
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submittingRating}
                >
                  {submittingRating ? 'Envoi...' : 'Soumettre mon avis'}
                </Button>
              </form>
            </div>
          )}

          {/* Ratings */}
          {ratings.length > 0 && (
            <div className="brutal-border bg-white brutal-shadow">
              <div className="border-b-4 border-black p-4 bg-[#E5E5E5]">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <h3 className="font-mono font-bold text-xl uppercase">
                    Avis ({ratings.length})
                  </h3>
                </div>
              </div>
              <div className="divide-y-4 divide-black">
                {ratings.map((r) => (
                  <div key={r.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span className="font-mono font-bold">
                          {r.user?.username || 'Anonyme'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-black" />
                        ))}
                      </div>
                    </div>
                    {r.comment && (
                      <p className="font-mono text-sm">{r.comment}</p>
                    )}
                    <p className="font-mono text-xs text-gray-600 mt-2">
                      {formatDate(r.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="brutal-border bg-white brutal-shadow">
            <div className="border-b-4 border-black p-4 bg-[#FF6B00]">
              <h3 className="font-mono font-bold uppercase">Statistiques</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-mono">Vues</span>
                </div>
                <span className="font-mono font-bold text-xl">{code.views || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Copy className="w-5 h-5" />
                  <span className="font-mono">Copies</span>
                </div>
                <span className="font-mono font-bold text-xl">{code.copies || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-mono">Validés</span>
                </div>
                <span className="font-mono font-bold text-xl">
                  {code.confirmations || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="brutal-border bg-white brutal-shadow">
            <div className="border-b-4 border-black p-4 bg-[#E5E5E5]">
              <h3 className="font-mono font-bold uppercase">Publié par</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5" />
                <span className="font-mono font-bold">
                  {code.user?.username || 'Anonyme'}
                </span>
              </div>
              <p className="font-mono text-sm text-gray-600">
                Le {formatDate(code.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
