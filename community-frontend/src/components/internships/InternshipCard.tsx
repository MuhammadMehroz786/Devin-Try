import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, ExternalLink, Calendar } from 'lucide-react';

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

interface InternshipCardProps {
  internship: Internship;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600"></div>
      <CardHeader className="pb-3 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              {internship.title}
            </CardTitle>
            <CardDescription className="text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {internship.company}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(internship.created_at)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {internship.location && (
            <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{internship.location}</span>
            </div>
          )}
          
          {internship.duration && (
            <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{internship.duration}</span>
            </div>
          )}
          
          {internship.stipend && (
            <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
              <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{internship.stipend}</span>
            </div>
          )}
        </div>
        
        {internship.apply_link && (
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 font-semibold"
            onClick={() => window.open(internship.apply_link, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
