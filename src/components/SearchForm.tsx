import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onSearch: (keyword: string) => Promise<void>;
  loading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      setError('Please enter a search keyword');
      return;
    }

    if (keyword.trim().length < 2) {
      setError('Keyword must be at least 2 characters long');
      return;
    }

    setError('');
    await onSearch(keyword.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-white/90 mb-2">
              Search GitHub Repositories
            </label>
            <div className="relative">
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter keywords (e.g., react, javascript, machine learning...)"
                className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !keyword.trim()}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search Repositories
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};