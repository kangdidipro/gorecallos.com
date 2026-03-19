
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
    <div className="relative w-full max-w-lg aspect-[4/5] perspective-1000 mx-auto">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-8",
          "bg-card border-2 border-primary/20 hover:border-primary/40 transition-colors shadow-xl rounded-3xl"
        )}>
          <div className="absolute top-8 left-8 text-xs font-bold text-primary/60 tracking-widest uppercase">
            Sync: {strength}%
          </div>
          
          <div className="text-[12rem] font-black font-headline text-primary neon-glow leading-none select-none">
            {entry.number}
          </div>

          <div className="mt-auto text-muted-foreground/40 uppercase tracking-[0.4em] text-[10px] font-bold">
            Tap to Reveal
          </div>
        </Card>

        {/* Back Side */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col p-10",
          "bg-card border-2 border-primary/10 shadow-xl rounded-3xl"
        )}>
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-border/50">
            <span className="text-5xl font-headline font-black text-primary">{entry.number}</span>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-40">Neural Data</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-70">Person</label>
              <p className="text-3xl font-headline font-bold text-foreground">{entry.person}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-70">Action</label>
              <p className="text-3xl font-headline font-bold text-foreground">{entry.action}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-70">Object</label>
              <p className="text-3xl font-headline font-bold text-foreground">{entry.object}</p>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-border/30">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 block">Etymology</label>
            <p className="text-sm text-muted-foreground/80 italic font-medium leading-relaxed">
              {entry.etymology}
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
