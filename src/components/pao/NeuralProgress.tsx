
"use client";

import { usePAOStore, NeuralStrengthMap } from '@/hooks/use-pao-store';
import { PAO_DATABASE } from '@/lib/pao-data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { RotateCcw, Zap, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function NeuralProgress() {
  const { blitzStrength, testStrength, resetProgress } = usePAOStore();

  const renderGrid = (data: NeuralStrengthMap) => (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      <TooltipProvider>
        {PAO_DATABASE.map((entry) => {
          const stats = data[entry.number] || { strength: 0 };
          const strength = stats.strength;
          
          return (
            <Tooltip key={entry.number}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "aspect-square rounded-md border border-border flex flex-col items-center justify-center transition-all cursor-help relative group overflow-hidden",
                    strength === 0 ? "bg-muted/5 opacity-30" : "bg-primary/5 border-primary/20"
                  )}
                >
                  <div 
                    className="absolute inset-x-0 bottom-0 bg-primary/20 transition-all duration-700 ease-out"
                    style={{ height: `${strength}%` }}
                  />
                  {strength === 100 && (
                    <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                  )}
                  <span className="relative z-10 text-xs font-bold font-headline">{entry.number}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-card border-primary/30 p-3 shadow-xl w-48">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-primary">Angka {entry.number}</p>
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded">{strength}%</span>
                  </div>
                  <div className="space-y-1 text-[11px] leading-tight">
                    <p><span className="text-muted-foreground uppercase text-[9px] font-bold">Person:</span> {entry.person}</p>
                    <p><span className="text-muted-foreground uppercase text-[9px] font-bold">Action:</span> {entry.action}</p>
                    <p><span className="text-muted-foreground uppercase text-[9px] font-bold">Object:</span> {entry.object}</p>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-primary" style={{ width: `${strength}%` }} />
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-2xl font-bold font-headline text-primary">Neural Synchronization</h3>
          <p className="text-sm text-muted-foreground">Analisis kekuatan memori berdasarkan mode latihan.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-muted/20 border border-border rounded-sm" /> 0%
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-primary rounded-sm shadow-[0_0_5px_hsl(var(--primary))]" /> 100%
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="blitz" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <TabsList className="bg-muted/20 p-1">
            <TabsTrigger value="blitz" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black">
              <Zap className="w-3 h-3" /> Blitz Strength
            </TabsTrigger>
            <TabsTrigger value="test" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-black">
              <Brain className="w-3 h-3" /> Test Strength
            </TabsTrigger>
          </TabsList>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 text-[10px] font-bold uppercase border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <RotateCcw className="w-3 h-3" /> Reset Mode Stats
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Progres Mode Ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Data kekuatan neural untuk mode yang terpilih akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => resetProgress()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Ya, Reset Sekarang
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <TabsContent value="blitz" className="mt-0">
          {renderGrid(blitzStrength)}
        </TabsContent>
        <TabsContent value="test" className="mt-0">
          {renderGrid(testStrength)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
