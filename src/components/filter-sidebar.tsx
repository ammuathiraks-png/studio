'use client';

import type { DateRange } from 'react-day-picker';
import { Filter, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';

type Filters = {
  product: string;
  category: string;
  region: string;
  dateRange: DateRange | undefined;
};

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  clearFilters: () => void;
  uniqueValues: {
    categories: string[];
    regions: string[];
  };
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  clearFilters,
  uniqueValues,
}: FilterSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
        <CardDescription>
          Refine the data shown in the table and charts.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="product">Product Name</Label>
          <Input
            id="product"
            placeholder="Search products..."
            value={filters.product}
            onChange={e => onFilterChange({ product: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category}
            onValueChange={value => onFilterChange({ category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {uniqueValues.categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="region">Region</Label>
          <Select
            value={filters.region}
            onValueChange={value => onFilterChange({ region: value })}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {uniqueValues.regions.map(region => (
                <SelectItem key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date Range</Label>
          <DateRangePicker
            date={filters.dateRange}
            onDateChange={value => onFilterChange({ dateRange: value })}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </CardFooter>
    </Card>
  );
}
