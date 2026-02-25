import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brutal-teal text-white mt-20 border-t-4 border-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-mono font-bold text-xl uppercase mb-4">
              CODE//SHARE
            </h3>
            <p className="font-mono text-sm leading-relaxed">
              La plateforme ultime pour partager et découvrir des codes de 
              parrainage et promotions pour entrepreneurs.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono font-bold uppercase mb-4">Navigation</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a href="/" className="hover:text-brutal-yellow transition-colors">
                  → Tous les codes
                </a>
              </li>
              <li>
                <a href="/submit" className="hover:text-brutal-yellow transition-colors">
                  → Soumettre un code
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-brutal-yellow transition-colors">
                  → Mon profil
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono font-bold uppercase mb-4">Contact</h4>
            <div className="flex space-x-4">
              <a
                href="mailto:contact@codeshare.fr"
                className="brutal-border bg-brutal-yellow text-black p-3 hover:bg-brutal-purple hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-border bg-brutal-yellow text-black p-3 hover:bg-brutal-purple hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-border bg-brutal-yellow text-black p-3 hover:bg-brutal-purple hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t-4 border-white">
          <p className="font-mono text-sm text-center">
            © {new Date().getFullYear()} CODE//SHARE • Fait avec ❤️ pour les entrepreneurs
          </p>
        </div>
      </div>
    </footer>
  );
};