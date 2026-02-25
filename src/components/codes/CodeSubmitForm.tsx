import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, TextArea, Select } from '../ui/form-components';
import { Button } from '../ui/button';
import { CATEGORIES, Category } from '../../types';
import { useAuthStore } from '../../store/authStore';
import * as api from '../../lib/api';
import { AlertCircle } from 'lucide-react';

export const CodeSubmitForm: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    category: 'SAAS' as Category,
    provider: '',
    discount: '',
    expiry_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Vous devez être connecté pour soumettre un code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newCode = await api.createCode({
        ...formData,
        expiry_date: formData.expiry_date || null,
        user_id: user.id,
      });

      navigate(`/code/${newCode.id}`);
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting code:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="brutal-border bg-brutal-purple text-white brutal-shadow-yellow mb-8">
        <div className="p-8">
          <h1 className="font-mono font-bold text-4xl uppercase mb-4">
            Partagez votre code
          </h1>
          <p className="font-mono text-lg">
            Aidez la communauté en partageant vos codes de parrainage et promotions.
            Chaque contribution aide des entrepreneurs à économiser sur leurs outils essentiels !
          </p>
        </div>
      </div>

      {/* Not logged in warning */}
      {!user && (
        <div className="brutal-border bg-brutal-yellow brutal-shadow mb-8">
          <div className="p-6 text-center">
            <p className="font-mono font-bold text-xl mb-4">
              ⚠️ Vous devez être connecté pour soumettre un code
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </Button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="brutal-border bg-white brutal-shadow">
        {/* Header */}
        <div className="border-b-4 border-black p-6 bg-brutal-teal text-white">
          <h2 className="font-mono font-bold text-2xl uppercase">
            Informations du code
          </h2>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="brutal-border bg-red-100 border-red-600 p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="font-mono text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Titre du code *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Compte pro Shine -50€"
              required
            />

            <Input
              label="Fournisseur *"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              placeholder="Ex: Shine, Notion, OVH..."
              required
            />
          </div>

          <TextArea
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez l'offre et les conditions d'utilisation..."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Code promo *"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Ex: STARTUP2024"
              required
            />

            <Input
              label="Réduction *"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Ex: -50€, 20% de réduction, 3 mois gratuits"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Catégorie *"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={CATEGORIES}
              required
            />

            <Input
              label="Date d'expiration (optionnel)"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange}
            />
          </div>

          {/* Info */}
          <div className="brutal-border bg-[#E5E5E5] p-4">
            <p className="font-mono text-sm">
              <strong>Note:</strong> Assurez-vous que le code est valide et vérifiable.
              Les codes invalides peuvent être supprimés par la communauté.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Soumission...' : 'Publier le code'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
