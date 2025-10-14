import { BookFilters as BookFiltersType } from '../book';
import { useState, useEffect } from 'react';
import { libraryApi } from '@/lib/api';

interface BookFiltersProps {
  filters: BookFiltersType;
  onFiltersChange: (filters: BookFiltersType) => void;
}

const categories = [
  'FICTION', 'NON_FICTION', 'SCIENCE_FICTION', 'FANTASY', 'MYSTERY',
  'THRILLER', 'ROMANCE', 'HORROR', 'BIOGRAPHY', 'HISTORY', 'SCIENCE',
  'TECHNOLOGY', 'ART', 'COOKBOOK', 'TRAVEL', 'CHILDREN', 'YOUNG_ADULT',
  'TEXTBOOK', 'REFERENCE'
];

export default function BookFilters({ filters, onFiltersChange }: BookFiltersProps) {
  const [availableLimits] = useState([10, 20, 50, 100]);

  const updateFilter = (key: keyof BookFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1 // Reset to first page when filters change
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 20,
    });
  };

  const hasActiveFilters = 
    filters.category || 
    filters.format || 
    filters.author || 
    filters.available !== undefined ||
    filters.search;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Books
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search in title, author, ISBN, description..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="" className="text-gray-500">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category} className="text-gray-900">
                {category.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Format Filter */}
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <select
            id="format"
            value={filters.format || ''}
            onChange={(e) => updateFilter('format', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="" className="text-gray-500">All Formats</option>
            <option value="PHYSICAL" className="text-gray-900">Physical</option>
            <option value="DIGITAL" className="text-gray-900">Digital</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label htmlFor="available" className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <select
            id="available"
            value={filters.available === undefined ? '' : filters.available.toString()}
            onChange={(e) => updateFilter('available', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="" className="text-gray-500">All</option>
            <option value="true" className="text-gray-900">Available</option>
            <option value="false" className="text-gray-900">Not Available</option>
          </select>
        </div>

        {/* Items per page */}
        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
            Items per page
          </label>
          <select
            id="limit"
            value={filters.limit || 20}
            onChange={(e) => updateFilter('limit', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            {availableLimits.map(limit => (
              <option key={limit} value={limit} className="text-gray-900">
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}