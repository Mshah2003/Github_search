import React, { useState, useEffect } from 'react';
import { Github, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { Dashboard } from './components/Dashboard';

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

interface Notification {
  type: 'success' | 'error';
  message: string;
}

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [currentSearch, setCurrentSearch] = useState<SearchResult | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const API_BASE = 'http://localhost:5000/api';

  // Load existing search results on component mount
  useEffect(() => {
    loadSearchResults();
  }, []);

  const loadSearchResults = async () => {
    try {
      const response = await fetch(`${API_BASE}/results`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Error loading search results:', error);
      showNotification('error', 'Failed to load search history');
    } finally {
      setInitialLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSearch = async (keyword: string) => {
    setLoading(true);
    setCurrentSearch(null);

    try {
      const response = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, per_page: 10 }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Search failed');
      }

      if (result.success) {
        const newSearchResult: SearchResult = {
          id: result.data.search_id,
          keyword: result.data.keyword,
          repository_data: result.data.repositories,
          total_count: result.data.total_count,
          created_at: result.data.created_at,
        };

        setCurrentSearch(newSearchResult);
        setSearchResults(prev => [newSearchResult, ...prev]);
        
        showNotification(
          'success', 
          `Found ${result.data.total_count.toLocaleString()} repositories for "${keyword}" and stored results in database!`
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      showNotification('error', error instanceof Error ? error.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <Github className="w-12 h-12 text-white/50" />
            <div className="w-32 h-4 bg-white/20 rounded"></div>
            <div className="w-48 h-3 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Github className="w-12 h-12 text-white" />
            <h1 className="text-4xl font-bold text-white">
              GitHub Repository Finder
            </h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Search for GitHub repositories, store results in database, and explore your search history. 
            All searches are automatically saved for future reference.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-400/30 inline-flex">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Database Integration Active</span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-md ${
            notification.type === 'success' 
              ? 'bg-green-500/20 text-green-300 border-green-400/30' 
              : 'bg-red-500/20 text-red-300 border-red-400/30'
          }`}>
            <div className="flex items-start space-x-3">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Dashboard */}
        <Dashboard 
          searchResults={searchResults} 
          loading={loading}
          currentSearch={currentSearch}
        />

        {/* Footer */}
        <footer className="mt-16 text-center text-white/50 text-sm">
          <p>
            Built with React, Express.js, Supabase, and GitHub API • {' '}
            <span className="text-white/70">Full-stack repository finder with database integration</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;