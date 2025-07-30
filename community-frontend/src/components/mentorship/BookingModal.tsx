import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, User } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  bio?: string;
  expertise?: string;
  profile_pic?: string;
  available_slots?: string;
  created_at: string;
}

interface BookingModalProps {
  mentor: Mentor;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ mentor, onClose, onSuccess }) => {
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!sessionDate || !sessionTime) {
      setError('Please select both date and time for your session');
      setLoading(false);
      return;
    }

    try {
      const sessionDateTime = new Date(`${sessionDate}T${sessionTime}`);
      
      if (sessionDateTime <= new Date()) {
        setError('Please select a future date and time');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentor_id: mentor.id,
          session_date: sessionDateTime.toISOString(),
          notes: notes.trim() || undefined,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to book session');
      }
    } catch (err) {
      setError('Error booking session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const selectedDate = new Date(sessionDate);
    const today = new Date();
    
    if (selectedDate.toDateString() === today.toDateString()) {
      const currentHour = today.getHours() + 1;
      return `${currentHour.toString().padStart(2, '0')}:00`;
    }
    return '09:00';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Book Session with {mentor.name}
          </DialogTitle>
          <DialogDescription>
            Schedule a mentorship session to get guidance and advice.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{mentor.name}</p>
                {mentor.expertise && (
                  <p className="text-sm text-purple-600">{mentor.expertise}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionDate">Date</Label>
              <Input
                id="sessionDate"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                min={getMinDateTime()}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTime">Time</Label>
              <Input
                id="sessionTime"
                type="time"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                min={sessionDate ? getMinTime() : '09:00'}
                max="18:00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="What would you like to discuss? Any specific topics or questions?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Session
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
