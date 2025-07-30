import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

interface HackathonFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  themeFilter: string;
  onThemeChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export const HackathonFilters: React.FC<HackathonFiltersProps> = ({
  searchTerm,
  onSearchChange,
  themeFilter,
  onThemeChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <Filter className="h-5 w-5 mr-2 text-green-600" />
          Filter Hackathons
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
                placeholder="Search name, organizer, theme..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={themeFilter} onValueChange={onThemeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All themes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All themes</SelectItem>
                <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                <SelectItem value="web-mobile">Web & Mobile</SelectItem>
                <SelectItem value="game-dev">Game Development</SelectItem>
                <SelectItem value="blockchain">Blockchain & Web3</SelectItem>
                <SelectItem value="sustainability">Sustainability & Climate</SelectItem>
                <SelectItem value="space-tech">Space Technology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="open">Open for registration</SelectItem>
                <SelectItem value="closed">Registration closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
