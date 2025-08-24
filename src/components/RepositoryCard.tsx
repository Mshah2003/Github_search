import React from 'react';
import { Star, GitFork, ExternalLink, User, Calendar } from 'lucide-react';

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

interface RepositoryCardProps {
  repository: Repository;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
      {/* Header with owner info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
            className="w-10 h-10 rounded-full border-2 border-white/20"
          />
          <div>
            <h3 className="text-lg font-semibold text-white hover:text-blue-300 transition-colors">
              <a 
                href={repository.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <span>{repository.name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </h3>
            <p className="text-sm text-white/70 flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{repository.owner.login}</span>
            </p>
          </div>
        </div>
        
        {repository.language && (
          <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
            {repository.language}
          </span>
        )}
      </div>

      {/* Description */}
      {repository.description && (
        <p className="text-white/80 text-sm mb-4 leading-relaxed">
          {repository.description}
        </p>
      )}

      {/* Stats and last updated */}
      <div className="flex items-center justify-between text-sm text-white/60">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{formatNumber(repository.stars)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span>{formatNumber(repository.forks)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(repository.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};