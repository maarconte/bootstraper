import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, User, LogOut, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const signOut = useAuthStore(s => s.signOut);
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="brutal-border bg-brutal-purple px-4 py-2 group-hover:bg-black transition-all">
              <span className="font-mono font-bold text-2xl text-white group-hover:text-white">
                CODE//SHARE
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 font-mono font-bold uppercase ${
                location.pathname === '/'
                  ? 'bg-black text-white'
                  : 'hover:bg-brutal-purple-light'
              }`}
            >
              Codes
            </Link>
            {user && (
              <Link
                to="/profile"
                className={`px-4 py-2 font-mono font-bold uppercase ${
                  location.pathname === '/profile'
                    ? 'bg-black text-white'
                    : 'hover:bg-brutal-purple-light'
                }`}
              >
                Profil
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/submit">
                  <Button variant="primary" size="sm">
                    <Plus className="w-4 h-4 mr-1 inline" />
                    Nouveau Code
                  </Button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="brutal-border bg-white px-3 py-2 hover:bg-black hover:text-white transition-all"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  <LogIn className="w-4 h-4 mr-1 inline" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t-4 border-black px-4 py-3 flex justify-around bg-brutal-cream">
        <Link
          to="/"
          className={`px-3 py-1 font-mono font-bold text-sm uppercase ${
            location.pathname === '/' ? 'bg-black text-white' : ''
          }`}
        >
          Codes
        </Link>
        {user && (
          <>
            <Link
              to="/submit"
              className={`px-3 py-1 font-mono font-bold text-sm uppercase brutal-border bg-brutal-purple text-white ${
                location.pathname === '/submit' ? 'bg-black' : ''
              }`}
            >
              + Ajouter
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-1 font-mono font-bold text-sm uppercase ${
                location.pathname === '/profile' ? 'bg-black text-white' : ''
              }`}
            >
              Profil
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
