"use client";

import { useState } from 'react';
import { PAO_DATABASE, PAOEntry } from '@/lib/pao-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, icons } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PAOTable() {
  const [search, setSearch] = useState("");

  const filteredData = PAO_DATABASE.filter(entry => 
    entry.number.includes(search) ||
    entry.person.toLowerCase().includes(search.toLowerCase()) ||
    entry.action.toLowerCase().includes(search.toLowerCase()) ||
    entry.object.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari angka, orang, atau aksi..."
          className="pl-10 bg-muted/20 border-border/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="max-h-[600px] overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-16 font-black text-primary">#</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Object</TableHead>
                <TableHead className="hidden md:table-cell">Etymology</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((entry) => {
                  const IconComponent = (icons as any)[entry.icon] || icons.Brain;
                  return (
                    <TableRow key={entry.number} className="hover:bg-primary/5 transition-colors group">
                      <TableCell className="font-black font-headline text-lg text-primary">
                        {entry.number}
                      </TableCell>
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          {entry.person}
                        </div>
                      </TableCell>
                      <TableCell className="text-secondary font-medium italic">
                        {entry.action}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.object}
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground italic leading-tight hidden md:table-cell max-w-xs">
                        {entry.etymology}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
