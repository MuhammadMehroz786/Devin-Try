import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { HackathonCard } from './HackathonCard';
import { HackathonFilters } from './HackathonFilters';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Calendar } from 'lucide-react';

interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  theme?: string;
  deadline: string;
  register_link?: string;
  description?: string;
  created_at: string;
  created_by: string;
}

export const HackathonsPage: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchHackathons();
  }, []);

  useEffect(() => {
    filterHackathons();
  }, [hackathons, searchTerm, themeFilter, statusFilter]);

  const fetchHackathons = async () => {
    try {
      const response = await fetch(`${API_URL}/hackathons`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHackathons(data);
      } else {
        setError('Failed to fetch hackathons');
      }
    } catch (err) {
      setError('Error loading hackathons');
    } finally {
      setLoading(false);
    }
  };

  const filterHackathons = () => {
    let filtered = hackathons;

    if (searchTerm) {
      filtered = filtered.filter(hackathon =>
        hackathon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.theme?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (themeFilter !== 'all') {
      filtered = filtered.filter(hackathon => {
        if (!hackathon.theme) return false;
        const theme = hackathon.theme.toLowerCase();
        
        switch (themeFilter) {
          case 'ai-ml':
            return theme.includes('ai') || theme.includes('machine learning') || theme.includes('artificial intelligence');
          case 'web-mobile':
            return theme.includes('web') || theme.includes('mobile') || theme.includes('app');
          case 'game-dev':
            return theme.includes('game') || theme.includes('gaming');
          case 'blockchain':
            return theme.includes('blockchain') || theme.includes('crypto') || theme.includes('web3');
          case 'sustainability':
            return theme.includes('climate') || theme.includes('sustainability') || theme.includes('environment');
          case 'space-tech':
            return theme.includes('space') || theme.includes('nasa') || theme.includes('satellite');
          default:
            return true;
        }
      });
    }

    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(hackathon => {
        const deadline = new Date(hackathon.deadline);
        
        switch (statusFilter) {
          case 'open':
            return deadline > now;
          case 'closed':
            return deadline <= now;
          default:
            return true;
        }
      });
    }

    setFilteredHackathons(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hackathons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-violet-500/25">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              Hackathons
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Join exciting hackathons and showcase your skills with innovative projects
            </p>
          </div>
          <Button className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/25">
            <Plus className="h-4 w-4" />
            <span>Post Hackathon</span>
          </Button>
        </div>

        <HackathonFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          themeFilter={themeFilter}
          onThemeChange={setThemeFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredHackathons.length} of {hackathons.length} hackathons
        </div>

        {filteredHackathons.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hackathons found</h3>
            <p className="text-gray-600">
              {hackathons.length === 0 
                ? "No hackathons have been posted yet. Be the first to post one!"
                : "Try adjusting your filters to see more results."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
