import { BookFilters as BookFiltersType } from '../book';
import { useState, useEffect } from 'react';
import { libraryApi } from '@/lib/api';

interface BookFiltersProps {
  filters: BookFiltersType;
  onFiltersChange: (filters: BookFiltersType) => void;
}

interface CategoriesResponseData {
  categories?: string[];
  data?: string[];
  items?: string[];
  [key: string]: unknown; // For other potential properties
}

export default function BookFilters({ filters, onFiltersChange }: BookFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [availableLimits] = useState([10, 20, 50, 100]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setError(null);
      console.log('Loading categories from API...');
      
      const response = await libraryApi.getCategories();
      console.log('Categories API Response:', response);
      
      if (response?.success) {
        // Handle different possible response structures
        let categoriesData: string[] = [];
        
        if (Array.isArray(response.data)) {
          // Direct array response
          categoriesData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // Handle object response - check for common properties
          const data = response.data as CategoriesResponseData;
          if (Array.isArray(data.categories)) {
            categoriesData = data.categories;
          } else if (Array.isArray(data.data)) {
            categoriesData = data.data;
          } else if (Array.isArray(data.items)) {
            categoriesData = data.items;
          } else {
            // If it's an object but we can't find array, try to extract values
            console.log('Object keys:', Object.keys(data));
            // Try to find any array property in the object
            const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
            if (arrayKeys.length > 0) {
              categoriesData = data[arrayKeys[0]] as string[];
            }
          }
        }
        
        console.log('Extracted categories:', categoriesData);
        
        if (categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          setError('No categories found in API response');
          setCategories([]);
        }
      } else {
        setError(response?.message || 'API returned unsuccessful response');
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError('Failed to load categories from server');
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

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

  const retryLoadCategories = () => {
    loadCategories();
  };

  const hasActiveFilters = 
    filters.category || 
    filters.format || 
    filters.author || 
    filters.available !== undefined ||
    filters.search;

  const formatCategory = (category: string) => {
    return category
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\b(A|An|The|And|Or|But|In|On|At|To|For|Of|With|By)\b/g, word => word.toLowerCase())
      .replace(/^\w/, l => l.toUpperCase());
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filter Books</h3>
          <p className="text-sm text-gray-600">Find exactly what you&apos;re looking for</p>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 flex items-center space-x-2 w-full lg:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear all filters</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
          <button
            onClick={retryLoadCategories}
            className="text-sm text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Books
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search in title, author, ISBN, description..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value || undefined)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
            {loadingCategories && (
              <span className="ml-2 text-xs text-blue-600">Loading...</span>
            )}
          </label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value || undefined)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
            disabled={loadingCategories}
          >
            <option value="" className="text-gray-500">All Categories</option>
            {loadingCategories ? (
              <option disabled>Loading categories...</option>
            ) : categories.length > 0 ? (
              categories.map(category => (
                <option key={category} value={category} className="text-gray-900">
                  {formatCategory(category)}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
          >
            {availableLimits.map(limit => (
              <option key={limit} value={limit} className="text-gray-900">
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <details className="text-xs">
            <summary className="cursor-pointer font-medium text-gray-700">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Categories loaded: {categories.length}</div>
              <div>Loading: {loadingCategories ? 'Yes' : 'No'}</div>
              <div>Error: {error || 'None'}</div>
              <div>Current filter: {filters.category || 'None'}</div>
              <div>Categories: {JSON.stringify(categories)}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}