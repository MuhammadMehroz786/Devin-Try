import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

interface InternshipFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  durationFilter: string;
  onDurationChange: (value: string) => void;
  stipendFilter: string;
  onStipendChange: (value: string) => void;
  workTypeFilter: string;
  onWorkTypeChange: (value: string) => void;
}

export const InternshipFilters: React.FC<InternshipFiltersProps> = ({
  searchTerm,
  onSearchChange,
  locationFilter,
  onLocationChange,
  durationFilter,
  onDurationChange,
  stipendFilter,
  onStipendChange,
  workTypeFilter,
  onWorkTypeChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <Filter className="h-5 w-5 mr-2 text-blue-600" />
          Filter Internships
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search title, company..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={locationFilter} onValueChange={onLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="san-francisco">San Francisco</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="toronto">Toronto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={durationFilter} onValueChange={onDurationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any duration</SelectItem>
                <SelectItem value="1-3-months">1-3 months</SelectItem>
                <SelectItem value="3-6-months">3-6 months</SelectItem>
                <SelectItem value="6-12-months">6-12 months</SelectItem>
                <SelectItem value="12-months">12+ months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stipend">Stipend</Label>
            <Select value={stipendFilter} onValueChange={onStipendChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any stipend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any stipend</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                <SelectItem value="2000-4000">$2,000 - $4,000</SelectItem>
                <SelectItem value="4000-plus">$4,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workType">Work Type</Label>
            <Select value={workTypeFilter} onValueChange={onWorkTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on-site">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
