'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import Pagination from '@/components/pagination';
import { SalesRecord } from '@/types';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

interface DataTableCardProps {
  data: SalesRecord[];
}

export default function DataTableCard({ data }: DataTableCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const isLoading = data.length === 0;

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          A list of recent sales from the database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="relative w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Region</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden sm:table-cell text-right">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right">
                        <Skeleton className="h-5 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : currentTableData.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.region}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right">
                        {format(new Date(item.saleDate), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
