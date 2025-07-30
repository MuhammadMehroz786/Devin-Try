import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ExternalLink, Users, Tag } from 'lucide-react';

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

interface HackathonCardProps {
  hackathon: Hackathon;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDeadline = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isDeadlinePassed = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const getTimeUntilDeadline = (dateString: string) => {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Registration closed';
    if (diffDays === 0) return 'Deadline today!';
    if (diffDays === 1) return '1 day left';
    if (diffDays <= 7) return `${diffDays} days left`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks left`;
    return `${Math.ceil(diffDays / 30)} months left`;
  };

  const deadlinePassed = isDeadlinePassed(hackathon.deadline);

  return (
    <Card className={`group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg relative overflow-hidden`}>
      <div className={`absolute inset-0 ${deadlinePassed ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gradient-to-br from-violet-50 to-violet-100'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${deadlinePassed ? 'bg-gradient-to-b from-gray-400 to-gray-500' : 'bg-gradient-to-b from-violet-500 to-violet-600'}`}></div>
      <CardHeader className="pb-3 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              {hackathon.name}
            </CardTitle>
            <CardDescription className={`text-base font-semibold ${deadlinePassed ? 'text-gray-600' : 'bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent'}`}>
              {hackathon.organizer}
            </CardDescription>
          </div>
          <Badge 
            variant="secondary"
            className={`ml-2 font-semibold ${deadlinePassed ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-violet-100 text-violet-800 border-violet-200'}`}
          >
            <Clock className="h-3 w-3 mr-1" />
            {getTimeUntilDeadline(hackathon.deadline)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        {hackathon.theme && (
          <div className="flex items-center text-sm text-gray-700 mb-4">
            <Tag className="h-4 w-4 mr-2 text-violet-500" />
            <span className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-violet-200">
              {hackathon.theme}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
            <Calendar className="h-4 w-4 mr-2 text-violet-500" />
            <span className="font-medium">Deadline: {formatDeadline(hackathon.deadline)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
            <Users className="h-4 w-4 mr-2 text-violet-500" />
            <span className="font-medium">Posted: {formatDate(hackathon.created_at)}</span>
          </div>
        </div>

        {hackathon.description && (
          <p className="text-sm text-gray-700 mb-6 line-clamp-2 leading-relaxed">
            {hackathon.description}
          </p>
        )}
        
        {hackathon.register_link && (
          <Button 
            className={`w-full sm:w-auto font-semibold shadow-lg ${
              deadlinePassed 
                ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed shadow-gray-400/25' 
                : 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-violet-500/25'
            }`}
            onClick={() => !deadlinePassed && window.open(hackathon.register_link, '_blank')}
            disabled={deadlinePassed}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {deadlinePassed ? 'Registration Closed' : 'Register Now'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
