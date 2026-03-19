
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
    <div 
      className="relative w-full max-w-lg aspect-[4/5] md:aspect-[3/4] cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front Side */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-12",
          "bg-card border-2 border-primary/20 hover:border-primary/50 transition-colors shadow-2xl"
        )}>
          <div className="absolute top-6 right-6 text-xs font-bold text-primary/40 uppercase tracking-widest">
            Neural Strength: {strength}%
          </div>
          <div className="text-9xl font-black font-headline text-primary neon-glow animate-glow-pulse">
            {entry.number}
          </div>
          <div className="mt-12 text-muted-foreground uppercase tracking-widest text-sm font-bold opacity-60">
            Sentuh untuk Membalik
          </div>
        </Card>

        {/* Back Side */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col p-10 overflow-y-auto",
          "bg-card border-2 border-secondary/20 shadow-2xl"
        )}>
          <div className="flex justify-between items-start mb-8">
            <span className="text-5xl font-headline font-bold text-secondary">{entry.number}</span>
            <div className="text-right">
              <span className="block text-xs text-muted-foreground uppercase tracking-wider font-bold">Identitas Neural</span>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <section>
              <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-1 opacity-70">Person (Tokoh)</h4>
              <p className="text-3xl font-headline font-bold text-foreground">{entry.person}</p>
            </section>
            
            <section>
              <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-1 opacity-70">Action (Aksi)</h4>
              <p className="text-3xl font-headline font-bold text-foreground">{entry.action}</p>
            </section>

            <section>
              <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-1 opacity-70">Object (Benda)</h4>
              <p className="text-3xl font-headline font-bold text-foreground">{entry.object}</p>
            </section>

            <section className="pt-6 border-t border-border mt-auto">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Etimologi / Logika Visual</h4>
              <p className="text-base leading-relaxed text-muted-foreground italic">
                {entry.etymology}
              </p>
            </section>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
