import React from 'react';
import { Code } from '../../types';
import { CodeCard } from './CodeCard';

interface CodeGridProps {
  codes: Code[];
  loading?: boolean;
}

export const CodeGrid: React.FC<CodeGridProps> = ({ codes, loading }) => {
  if (loading) {
    return (
      <div className="brutal-grid-asymmetric">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="brutal-border bg-[#E5E5E5] h-96 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="brutal-border brutal-shadow bg-white p-12 text-center">
        <p className="font-mono text-2xl font-bold uppercase mb-4">
          Aucun code trouvé
        </p>
        <p className="font-mono text-gray-600">
          Essayez de modifier vos filtres ou soyez le premier à en ajouter un !
        </p>
      </div>
    );
  }

  return (
    <div className="brutal-grid-asymmetric">
      {codes.map((code) => (
        <CodeCard key={code.id} code={code} />
      ))}
    </div>
  );
};
