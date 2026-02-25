import React from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import { CATEGORIES, FilterState, SortBy, Category } from '../../types';
import { Input, Select } from '../ui/form-components';
import { Button } from '../ui/button';

interface CodeFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const CodeFilters: React.FC<CodeFiltersProps> = ({ filters, onFilterChange }) => {
  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'popular', label: 'Plus populaires' },
    { value: 'top-rated', label: 'Mieux notés' },
    { value: 'expiring', label: 'Expire bientôt' },
  ];

  const categoryOptions = [
    { value: 'ALL', label: 'Toutes catégories' },
    ...CATEGORIES,
  ];

  return (
    <div className="brutal-border bg-white brutal-shadow mb-8">
      {/* Header */}
      <div className="border-b-4 border-black p-4 bg-[var(--brutal-orange)]">
        <div className="flex items-center space-x-2">
          <Filter className="w-6 h-6" />
          <h2 className="font-mono font-bold text-xl uppercase">Filtres</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Rechercher par titre, description, fournisseur..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Grid filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category */}
          <Select
            label="Catégorie"
            value={filters.category}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                category: e.target.value as Category | 'ALL',
              })
            }
            options={categoryOptions}
          />

          {/* Sort */}
          <Select
            label="Trier par"
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as SortBy,
              })
            }
            options={sortOptions}
          />

          {/* Show expired */}
          <div>
            <label className="block mb-2 font-mono font-bold uppercase text-sm">
              Options
            </label>
            <label className="flex items-center space-x-3 brutal-border bg-white px-4 py-3 cursor-pointer hover:bg-[var(--brutal-gray)] transition-colors">
              <input
                type="checkbox"
                checked={filters.showExpired}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    showExpired: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
              <span className="font-mono text-sm">Afficher codes expirés</span>
            </label>
          </div>
        </div>

        {/* Reset */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onFilterChange({
                category: 'ALL',
                search: '',
                sortBy: 'recent',
                showExpired: false,
              })
            }
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
};
