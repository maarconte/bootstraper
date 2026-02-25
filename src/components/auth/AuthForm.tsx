import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Input } from '../ui/form-components';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';

interface AuthFormProps {
  mode: 'login' | 'signup';
}


export const AuthForm: React.FC<AuthFormProps> = ({ mode : any }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const signIn = useAuthStore(s => s.signIn);
  const signUp = useAuthStore(s => s.signUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (!formData.username) {
          throw new Error('Le nom d\'utilisateur est requis');
        }
        await signUp(formData.email, formData.password, formData.username);
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Erreur d\'authentification');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="brutal-border bg-white brutal-shadow max-w-md mx-auto">
      {/* Header */}
      <div className="border-b-4 border-black p-6 bg-[#FF6B00]">
        <h2 className="font-mono font-bold text-2xl uppercase text-center">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="brutal-border bg-red-100 border-red-600 p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="font-mono text-sm text-red-600">{error}</p>
          </div>
        )}

        {mode === 'signup' && (
          <div className="relative">
            <Input
              label="Nom d'utilisateur *"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="votre_pseudo"
              required
            />
            <User className="absolute right-4 top-11 w-5 h-5 text-gray-400" />
          </div>
        )}

        <div className="relative">
          <Input
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            required
          />
          <Mail className="absolute right-4 top-11 w-5 h-5 text-gray-400" />
        </div>

        <div className="relative">
          <Input
            label="Mot de passe *"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <Lock className="absolute right-4 top-11 w-5 h-5 text-gray-400" />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading
            ? 'Chargement...'
            : mode === 'login'
            ? 'Se connecter'
            : 'Créer un compte'}
        </Button>

        {/* Toggle */}
        <div className="text-center font-mono text-sm">
          {mode === 'login' ? (
            <p>
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-[#FF6B00] font-bold hover:underline">
                S'inscrire
              </Link>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <Link to="/login" className="text-[#FF6B00] font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
