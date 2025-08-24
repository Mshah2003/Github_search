import React from 'react';
import { Clock, Search, Database, TrendingUp, AlertCircle } from 'lucide-react';
import { RepositoryCard } from './RepositoryCard';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stars: number;
  forks: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface SearchResult {
  id: string;
  keyword: string;
  repository_data: Repository[];
  total_count: number;
  created_at: string;
}

interface DashboardProps {
  searchResults: SearchResult[];
  loading: boolean;
  currentSearch: SearchResult | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  searchResults, 
  loading, 
  currentSearch 
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalRepositories = (): number => {
    return searchResults.reduce((total, search) => total + search.repository_data.length, 0);
  };

  const getUniqueKeywords = (): number => {
    const keywords = new Set(searchResults.map(search => search.keyword.toLowerCase()));
    return keywords.size;
  };

  if (loading && !currentSearch) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
            <div className="w-32 h-4 bg-white/20 rounded"></div>
            <div className="w-48 h-3 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{searchResults.length}</p>
              <p className="text-white/70 text-sm">Total Searches</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{getTotalRepositories()}</p>
              <p className="text-white/70 text-sm">Repositories Found</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3">
            <Search className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{getUniqueKeywords()}</p>
              <p className="text-white/70 text-sm">Unique Keywords</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Search Results */}
      {currentSearch && (
        <div className="mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Latest Search: "{currentSearch.keyword}"
                </h2>
                <p className="text-white/70">
                  Found {currentSearch.total_count.toLocaleString()} repositories • {' '}
                  Searched {formatDate(currentSearch.created_at)}
                </p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-400/30">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">Stored in Database</span>
              </div>
            </div>
          </div>

          {currentSearch.repository_data.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {currentSearch.repository_data.map((repo) => (
                <RepositoryCard key={repo.id} repository={repo} />
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-white/80">No repositories found for this search.</p>
            </div>
          )}
        </div>
      )}

      {/* Search History */}
      {searchResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Clock className="w-6 h-6" />
            <span>Search History</span>
          </h2>
          
          <div className="space-y-4">
            {searchResults.map((search) => (
              <div 
                key={search.id} 
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      "{search.keyword}"
                    </h3>
                    <p className="text-white/70 text-sm">
                      {search.repository_data.length} repositories stored • {' '}
                      Total found: {search.total_count.toLocaleString()} • {' '}
                      {formatDate(search.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                      {search.repository_data.length} repos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !loading && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
          <Search className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No searches yet</h3>
          <p className="text-white/70">
            Start by searching for GitHub repositories using the form above. All your searches will be stored and displayed here.
          </p>
        </div>
      )}
    </div>
  );
};