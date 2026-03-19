
"use client";

import { usePAOStore } from '@/hooks/use-pao-store';
import { PAO_DATABASE } from '@/lib/pao-data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function NeuralProgress() {
  const { neuralStrength } = usePAOStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold font-headline text-primary">Neural Strength</h3>
          <p className="text-sm text-muted-foreground">Kekuatan memori terintegrasi per angka.</p>
        </div>
        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-muted rounded-sm" /> 0%</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded-sm" /> 100%</div>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        <TooltipProvider>
          {PAO_DATABASE.map((entry) => {
            const stats = neuralStrength[entry.number] || { strength: 0 };
            const strength = stats.strength;
            
            return (
              <Tooltip key={entry.number}>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "aspect-square rounded-md border border-border flex flex-col items-center justify-center transition-all cursor-help relative group",
                      strength === 0 ? "bg-muted/10 opacity-30" : "bg-primary/5 border-primary/30"
                    )}
                  >
                    <div 
                      className="absolute inset-0 bg-primary/20 transition-all duration-1000"
                      style={{ height: `${strength}%`, bottom: 0, top: 'auto' }}
                    />
                    <span className="relative z-10 text-xs font-bold font-headline">{entry.number}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-card border-primary/30 p-3 shadow-xl">
                  <div className="space-y-1">
                    <p className="font-bold text-primary">Angka {entry.number}</p>
                    <p className="text-xs">{entry.person}</p>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-primary" style={{ width: `${strength}%` }} />
                    </div>
                    <p className="text-[10px] text-right text-muted-foreground mt-1">{strength}% Strength</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
