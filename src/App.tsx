import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Container } from './components/layout/Container';
import { CodeGrid } from './components/codes/CodeGrid';
import { CodeFilters } from './components/codes/CodeFilters';
import { CodeDetails } from './components/codes/CodeDetails';
import { CodeSubmitForm } from './components/codes/CodeSubmitForm';
import { AuthForm } from './components/auth/AuthForm';
import { UserProfile } from './components/auth/UserProfile';
import { SeedButton } from './components/admin/SeedButton';
import { useCodes } from './lib/hooks';
import { FilterState } from './types';
import { Zap } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Button } from './components/ui/Button';

// Home Page
const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: 'ALL',
    search: '',
    sortBy: 'recent',
    showExpired: false,
  });

  const { codes, loading, error } = useCodes(filters);

  return (
    <Container>
      {/* Hero */}
      <div className="brutal-border bg-brutal-purple text-white brutal-shadow-yellow mb-12 overflow-hidden">
        <div className="p-12 text-center relative">
          <div className="absolute top-4 left-4 brutal-border bg-brutal-yellow p-2">
            <Zap className="w-8 h-8 text-black" />
          </div>
          <div className="absolute bottom-4 right-4 brutal-border bg-brutal-teal p-2">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-mono font-bold text-5xl md:text-6xl uppercase mb-6">
            CODE//SHARE
          </h1>
          <p className="font-mono text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            LA PLATEFORME ULTIME DE CODES PROMO POUR ENTREPRENEURS
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="brutal-border bg-brutal-yellow px-6 py-3">
              <span className="font-mono font-bold uppercase text-black">100% Gratuit</span>
            </div>
            <div className="brutal-border bg-brutal-teal text-white px-6 py-3">
              <span className="font-mono font-bold uppercase">Communauté Active</span>
            </div>
            <div className="brutal-border bg-white text-black px-6 py-3">
              <span className="font-mono font-bold uppercase">Codes Vérifiés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="brutal-border bg-white brutal-shadow mb-12">
        <div className="p-8">
          <h2 className="font-mono font-bold text-3xl uppercase mb-4">
            Pourquoi CODE//SHARE ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            <div>
              <div className="brutal-border bg-brutal-purple text-white p-3 inline-block mb-3">
                <span className="font-bold text-2xl">01</span>
              </div>
              <h3 className="font-bold uppercase mb-2">Économisez des milliers d'€</h3>
              <p className="text-sm">
                Accédez aux meilleurs codes de parrainage pour banques pro, outils SaaS, 
                hébergement et services essentiels.
              </p>
            </div>
            <div>
              <div className="brutal-border bg-brutal-teal text-white p-3 inline-block mb-3">
                <span className="font-bold text-2xl">02</span>
              </div>
              <h3 className="font-bold uppercase mb-2">Validé par la communauté</h3>
              <p className="text-sm">
                Tous les codes sont notés et commentés par des entrepreneurs comme vous. 
                Fini les codes expirés !
              </p>
            </div>
            <div>
              <div className="brutal-border bg-brutal-yellow text-black p-3 inline-block mb-3">
                <span className="font-bold text-2xl">03</span>
              </div>
              <h3 className="font-bold uppercase mb-2">Partagez vos trouvailles</h3>
              <p className="text-sm">
                Vous avez un bon plan ? Partagez-le avec la communauté et aidez 
                d'autres entrepreneurs à démarrer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seed button si aucun code */}
      {!loading && codes.length === 0 && !error && <SeedButton />}

      {/* Call to Action - Submit Code */}
      {codes.length > 0 && (
        <div className="brutal-border bg-brutal-yellow brutal-shadow mb-8">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-mono font-bold text-2xl uppercase mb-2">
                Vous avez un bon plan ?
              </h3>
              <p className="font-mono">
                Partagez vos codes de parrainage et aidez d'autres entrepreneurs à économiser !
              </p>
            </div>
            <Link to="/submit">
              <Button variant="primary" size="lg">
                <Plus className="w-5 h-5 mr-2 inline" />
                Partager un code
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <CodeFilters filters={filters} onFilterChange={setFilters} />

      {/* Error */}
      {error && (
        <div className="brutal-border bg-red-100 border-red-600 p-6 mb-8">
          <p className="font-mono text-red-600">{error}</p>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="font-mono font-bold text-xl">
          {loading ? 'Chargement...' : `${codes.length} CODE(S) TROUVÉ(S)`}
        </p>
      </div>

      {/* Grid */}
      <CodeGrid codes={codes} loading={loading} />
    </Container>
  );
};

// Submit Page
const SubmitPage: React.FC = () => {
  return (
    <Container>
      <CodeSubmitForm />
    </Container>
  );
};

// Login/Signup Pages
const LoginPage: React.FC = () => {
  return (
    <Container className="py-12">
      <AuthForm mode="login" />
    </Container>
  );
};

const SignupPage: React.FC = () => {
  return (
    <Container className="py-12">
      <AuthForm mode="signup" />
    </Container>
  );
};

// Main App
export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/code/:id" element={<CodeDetails />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}