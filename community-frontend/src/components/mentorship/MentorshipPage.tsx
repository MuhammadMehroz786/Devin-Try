import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MentorCard } from './MentorCard';
import { MentorFilters } from './MentorFilters';
import { BookingModal } from './BookingModal';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Users } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  bio?: string;
  expertise?: string;
  profile_pic?: string;
  available_slots?: string;
  created_at: string;
}

interface Booking {
  id: string;
  mentor_id: string;
  user_id: string;
  session_date: string;
  status: string;
  notes?: string;
  created_at: string;
}

export const MentorshipPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchMentors();
    fetchUserBookings();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, searchTerm, expertiseFilter, availabilityFilter]);

  const fetchMentors = async () => {
    try {
      const response = await fetch(`${API_URL}/mentors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMentors(data);
      } else {
        setError('Failed to fetch mentors');
      }
    } catch (err) {
      setError('Error loading mentors');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserBookings(data);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };

  const filterMentors = () => {
    let filtered = mentors;

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (expertiseFilter !== 'all') {
      filtered = filtered.filter(mentor => {
        if (!mentor.expertise) return false;
        const expertise = mentor.expertise.toLowerCase();
        
        switch (expertiseFilter) {
          case 'software-engineering':
            return expertise.includes('software') || expertise.includes('engineering') || expertise.includes('development');
          case 'data-science':
            return expertise.includes('data') || expertise.includes('analytics') || expertise.includes('machine learning');
          case 'product-management':
            return expertise.includes('product') || expertise.includes('management') || expertise.includes('strategy');
          case 'design':
            return expertise.includes('design') || expertise.includes('ux') || expertise.includes('ui');
          case 'marketing':
            return expertise.includes('marketing') || expertise.includes('growth') || expertise.includes('sales');
          case 'entrepreneurship':
            return expertise.includes('entrepreneur') || expertise.includes('startup') || expertise.includes('founder');
          default:
            return true;
        }
      });
    }

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(mentor => {
        const slots = mentor.available_slots || '0';
        const availableSlots = parseInt(slots) || 0;
        
        switch (availabilityFilter) {
          case 'available':
            return availableSlots > 0;
          case 'limited':
            return availableSlots > 0 && availableSlots <= 2;
          case 'unavailable':
            return availableSlots === 0;
          default:
            return true;
        }
      });
    }

    setFilteredMentors(filtered);
  };

  const handleBookMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedMentor(null);
    fetchUserBookings();
    fetchMentors();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-amber-500/25">
                <Users className="h-6 w-6 text-white" />
              </div>
              Mentorship
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Connect with industry professionals and get personalized guidance
            </p>
          </div>
          <Button className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25">
            <Plus className="h-4 w-4" />
            <span>Become a Mentor</span>
          </Button>
        </div>

        <MentorFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          expertiseFilter={expertiseFilter}
          onExpertiseChange={setExpertiseFilter}
          availabilityFilter={availabilityFilter}
          onAvailabilityChange={setAvailabilityFilter}
        />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredMentors.length} of {mentors.length} mentors
        </div>

        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600">
              {mentors.length === 0 
                ? "No mentors are available yet. Check back later!"
                : "Try adjusting your filters to see more results."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard 
                key={mentor.id} 
                mentor={mentor} 
                onBookSession={() => handleBookMentor(mentor)}
                userBookings={userBookings}
              />
            ))}
          </div>
        )}

        {showBookingModal && selectedMentor && (
          <BookingModal
            mentor={selectedMentor}
            onClose={() => setShowBookingModal(false)}
            onSuccess={handleBookingSuccess}
          />
        )}
      </div>
    </div>
  );
};
