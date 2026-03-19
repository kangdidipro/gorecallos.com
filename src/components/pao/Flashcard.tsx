
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PAOEntry } from '@/lib/pao-data';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  entry: PAOEntry;
  strength: number;
}

export function Flashcard({ entry, strength }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full max-w-lg aspect-[3/4] perspective-1000 group mx-auto">
      {/* Deck Layers (Visual Stack) */}
      <div className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/10 translate-x-2 translate-y-2 -z-10" />
      <div className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20 translate-x-4 translate-y-4 -z-20 shadow-xl" />

      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-8",
          "bg-card border-2 border-primary/20 hover:border-primary/50 transition-colors shadow-2xl rounded-2xl"
        )}>
          <div className="absolute top-6 right-8 text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">
            Neural Sync: {strength}%
          </div>
          
          <div className="relative">
             <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-full opacity-50" />
             <div className="text-[12rem] font-black font-headline text-primary neon-glow leading-none relative z-10">
              {entry.number}
            </div>
          </div>

          <div className="mt-auto pt-8 text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold opacity-40">
            Tap to Reveal
          </div>
        </Card>

        {/* Back Side */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col p-8 overflow-y-auto",
          "bg-card border-2 border-secondary/20 shadow-2xl rounded-2xl"
        )}>
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-border/50">
            <span className="text-4xl font-headline font-black text-secondary">{entry.number}</span>
            <div className="text-right">
              <span className="block text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Data Terenkripsi</span>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <section className="space-y-1">
              <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] opacity-60">Person</h4>
              <p className="text-3xl font-headline font-bold text-foreground leading-tight">{entry.person}</p>
            </section>
            
            <section className="space-y-1">
              <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] opacity-60">Action</h4>
              <p className="text-3xl font-headline font-bold text-foreground leading-tight">{entry.action}</p>
            </section>

            <section className="space-y-1">
              <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] opacity-60">Object</h4>
              <p className="text-3xl font-headline font-bold text-foreground leading-tight">{entry.object}</p>
            </section>

            <div className="mt-auto pt-6 border-t border-border/50">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Visual Etymology</h4>
              <p className="text-sm leading-relaxed text-muted-foreground/80 italic font-medium">
                {entry.etymology}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
