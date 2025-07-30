import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { InternshipCard } from './InternshipCard';
import { InternshipFilters } from './InternshipFilters';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Briefcase } from 'lucide-react';

interface Internship {
  id: string;
  title: string;
  company: string;
  location?: string;
  stipend?: string;
  duration?: string;
  apply_link?: string;
  created_at: string;
  created_by: string;
}

export const InternshipsPage: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [stipendFilter, setStipendFilter] = useState('all');
  const [workTypeFilter, setWorkTypeFilter] = useState('all');

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, searchTerm, locationFilter, durationFilter, stipendFilter, workTypeFilter]);

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${API_URL}/internships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      } else {
        setError('Failed to fetch internships');
      }
    } catch (err) {
      setError('Error loading internships');
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = internships;

    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(internship => {
        if (locationFilter === 'remote') {
          return internship.location?.toLowerCase().includes('remote');
        }
        return internship.location?.toLowerCase().includes(locationFilter.replace('-', ' '));
      });
    }

    if (durationFilter !== 'all') {
      filtered = filtered.filter(internship => {
        if (!internship.duration) return false;
        const duration = internship.duration.toLowerCase();
        
        switch (durationFilter) {
          case '1-3-months':
            return duration.includes('1') || duration.includes('2') || duration.includes('3');
          case '3-6-months':
            return duration.includes('3') || duration.includes('4') || duration.includes('5') || duration.includes('6');
          case '6-12-months':
            return duration.includes('6') || duration.includes('9') || duration.includes('12');
          case '12-months':
            return duration.includes('12') || duration.includes('year');
          default:
            return true;
        }
      });
    }

    if (workTypeFilter !== 'all') {
      filtered = filtered.filter(internship => {
        if (!internship.location) return false;
        const location = internship.location.toLowerCase();
        
        switch (workTypeFilter) {
          case 'remote':
            return location.includes('remote');
          case 'on-site':
            return !location.includes('remote') && !location.includes('hybrid');
          case 'hybrid':
            return location.includes('hybrid');
          default:
            return true;
        }
      });
    }

    setFilteredInternships(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/25">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              Internships
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Discover amazing internship opportunities from top companies and kickstart your career
            </p>
          </div>
          <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25">
            <Plus className="h-4 w-4" />
            <span>Post Internship</span>
          </Button>
        </div>

        <InternshipFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          durationFilter={durationFilter}
          onDurationChange={setDurationFilter}
          stipendFilter={stipendFilter}
          onStipendChange={setStipendFilter}
          workTypeFilter={workTypeFilter}
          onWorkTypeChange={setWorkTypeFilter}
        />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredInternships.length} of {internships.length} internships
        </div>

        {filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
            <p className="text-gray-600">
              {internships.length === 0 
                ? "No internships have been posted yet. Be the first to post one!"
                : "Try adjusting your filters to see more results."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
