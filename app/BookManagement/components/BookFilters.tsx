import { BookFilters as BookFiltersType } from '../book';
import { useState } from 'react';

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

  const updateFilter = <K extends keyof BookFiltersType>(key: K, value: BookFiltersType[K]) => {
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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Search - Full width on mobile, spans 2 columns on larger screens */}
        <div className="xs:col-span-2 md:col-span-3 lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Books
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search in title, author, ISBN, description..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 text-sm sm:text-base"
          />
        </div>

        {/* Category Filter */}
        <div className="xs:col-span-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value || undefined)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
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
        <div className="xs:col-span-1">
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <select
            id="format"
            value={filters.format || ''}
            onChange={(e) => updateFilter('format', e.target.value || undefined)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
          >
            <option value="" className="text-gray-500">All Formats</option>
            <option value="PHYSICAL" className="text-gray-900">Physical</option>
            <option value="DIGITAL" className="text-gray-900">Digital</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div className="xs:col-span-1">
          <label htmlFor="available" className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <select
            id="available"
            value={filters.available === undefined ? '' : filters.available.toString()}
            onChange={(e) => updateFilter('available', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
          >
            <option value="" className="text-gray-500">All</option>
            <option value="true" className="text-gray-900">Available</option>
            <option value="false" className="text-gray-900">Not Available</option>
          </select>
        </div>

        {/* Items per page */}
        <div className="xs:col-span-1">
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
            Items per page
          </label>
          <select
            id="limit"
            value={filters.limit || 20}
            onChange={(e) => updateFilter('limit', parseInt(e.target.value))}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
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
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200 hover:border-blue-300"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}