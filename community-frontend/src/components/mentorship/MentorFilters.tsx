import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

interface MentorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  expertiseFilter: string;
  onExpertiseChange: (value: string) => void;
  availabilityFilter: string;
  onAvailabilityChange: (value: string) => void;
}

export const MentorFilters: React.FC<MentorFiltersProps> = ({
  searchTerm,
  onSearchChange,
  expertiseFilter,
  onExpertiseChange,
  availabilityFilter,
  onAvailabilityChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <Filter className="h-5 w-5 mr-2 text-purple-600" />
          Filter Mentors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search name, bio, expertise..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise</Label>
            <Select value={expertiseFilter} onValueChange={onExpertiseChange}>
              <SelectTrigger>
                <SelectValue placeholder="All expertise areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All expertise areas</SelectItem>
                <SelectItem value="software-engineering">Software Engineering</SelectItem>
                <SelectItem value="data-science">Data Science & Analytics</SelectItem>
                <SelectItem value="product-management">Product Management</SelectItem>
                <SelectItem value="design">Design & UX</SelectItem>
                <SelectItem value="marketing">Marketing & Growth</SelectItem>
                <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select value={availabilityFilter} onValueChange={onAvailabilityChange}>
              <SelectTrigger>
                <SelectValue placeholder="All availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All availability</SelectItem>
                <SelectItem value="available">Available (3+ slots)</SelectItem>
                <SelectItem value="limited">Limited (1-2 slots)</SelectItem>
                <SelectItem value="unavailable">Currently unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
