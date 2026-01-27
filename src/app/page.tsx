'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { DateRange } from 'react-day-picker';

import { SalesRecord } from '@/types';
import { mockData } from '@/lib/mock-data';
import Header from '@/components/header';
import FilterSidebar from '@/components/filter-sidebar';
import ChartSuggester from '@/components/chart-suggester';
import DataVisualizationCard from '@/components/data-visualization-card';
import DataTableCard from '@/components/data-table-card';

type Filters = {
  product: string;
  category: string;
  region: string;
  dateRange: DateRange | undefined;
};

export default function DashboardPage() {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [filteredData, setFilteredData] = useState<SalesRecord[]>([]);
  const [filters, setFilters] = useState<Filters>({
    product: '',
    category: 'all',
    region: 'all',
    dateRange: undefined,
  });

  useEffect(() => {
    // TODO: Replace this with a call to your Firebase Realtime Database
    setData(mockData);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      product: '',
      category: 'all',
      region: 'all',
      dateRange: undefined,
    });
  }, []);

  useEffect(() => {
    let tempData = [...data];

    if (filters.product) {
      tempData = tempData.filter(item =>
        item.product.toLowerCase().includes(filters.product.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      tempData = tempData.filter(item => item.category === filters.category);
    }

    if (filters.region !== 'all') {
      tempData = tempData.filter(item => item.region === filters.region);
    }

    if (filters.dateRange?.from) {
      tempData = tempData.filter(
        item => new Date(item.saleDate) >= (filters.dateRange?.from as Date)
      );
    }
    if (filters.dateRange?.to) {
      tempData = tempData.filter(
        item => new Date(item.saleDate) <= (filters.dateRange?.to as Date)
      );
    }

    setFilteredData(tempData);
  }, [data, filters]);

  const uniqueValues = useMemo(() => {
    const categories = ['all', ...Array.from(new Set(data.map(item => item.category)))];
    const regions = ['all', ...Array.from(new Set(data.map(item => item.region)))];
    return { categories, regions };
  }, [data]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="grid flex-1 items-start gap-8 p-4 sm:px-6 md:p-8 lg:grid-cols-3 xl:grid-cols-4">
        <div className="grid auto-rows-max items-start gap-8 lg:col-span-2 xl:col-span-3">
          <Header />
          <DataVisualizationCard data={filteredData} />
          <DataTableCard data={filteredData} />
        </div>
        <div className="sticky top-8 grid auto-rows-max items-start gap-8 lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            clearFilters={clearFilters}
            uniqueValues={uniqueValues}
          />
          <ChartSuggester />
        </div>
      </div>
    </div>
  );
}
