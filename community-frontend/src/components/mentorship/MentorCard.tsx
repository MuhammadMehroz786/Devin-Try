import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Star, CheckCircle } from 'lucide-react';

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

interface MentorCardProps {
  mentor: Mentor;
  onBookSession: () => void;
  userBookings: Booking[];
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBookSession, userBookings }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const availableSlots = parseInt(mentor.available_slots || '0') || 0;
  const hasBookedSession = userBookings.some(booking => 
    booking.mentor_id === mentor.id && booking.status === 'pending'
  );

  const getAvailabilityBadge = () => {
    if (availableSlots === 0) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-semibold border-gray-200">Unavailable</Badge>;
    } else if (availableSlots <= 2) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-semibold border-orange-200">Limited slots</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold border-green-200">Available</Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-amber-600"></div>
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start space-x-4">
          <Avatar className="h-14 w-14 ring-2 ring-amber-200 ring-offset-2">
            <AvatarImage src={mentor.profile_pic} alt={mentor.name} />
            <AvatarFallback className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg">
              {getInitials(mentor.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              {mentor.name}
            </CardTitle>
            {mentor.expertise && (
              <CardDescription className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                {mentor.expertise}
              </CardDescription>
            )}
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {getAvailabilityBadge()}
            {hasBookedSession && (
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 text-xs font-semibold border-teal-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Booked
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        {mentor.bio && (
          <p className="text-sm text-gray-700 mb-6 line-clamp-3 leading-relaxed">
            {mentor.bio}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-700 mb-6">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
            <Clock className="h-4 w-4 mr-2 text-amber-500" />
            <span className="font-medium">{availableSlots} slots available</span>
          </div>
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="font-medium">4.8 rating</span>
          </div>
        </div>
        
        <Button 
          className={`w-full font-semibold shadow-lg ${
            availableSlots === 0 || hasBookedSession
              ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed shadow-gray-400/25' 
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/25'
          }`}
          onClick={onBookSession}
          disabled={availableSlots === 0 || hasBookedSession}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {hasBookedSession ? 'Session Booked' : availableSlots === 0 ? 'Unavailable' : 'Book Session'}
        </Button>
      </CardContent>
    </Card>
  );
};
