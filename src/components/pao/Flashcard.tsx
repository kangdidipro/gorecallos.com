
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PAOEntry } from '@/lib/pao-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  entry: PAOEntry;
  strength: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export function Flashcard({ entry, strength, onNext, onPrev }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full max-w-lg aspect-[4/5] mx-auto group">
      {/* Navigation Overlays (Desktop - Inside Container) */}
      <div className="absolute inset-y-0 left-2 hidden md:flex items-center z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-background/10 backdrop-blur-sm hover:bg-primary/20 text-primary"
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-2 hidden md:flex items-center z-20">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-background/10 backdrop-blur-sm hover:bg-primary/20 text-primary"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Card Container */}
      <div className="relative w-full h-full perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side */}
          <Card className={cn(
            "absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-8",
            "bg-card border-2 border-primary/20 hover:border-primary/40 transition-colors shadow-2xl rounded-3xl"
          )}>
            <div className="absolute top-8 left-8 text-[10px] font-bold text-primary/60 tracking-widest uppercase">
              Neural Sync: {strength}%
            </div>
            
            <div className="text-[12rem] font-black font-headline text-primary neon-glow leading-none select-none">
              {entry.number}
            </div>

            <div className="mt-auto text-muted-foreground/40 uppercase tracking-[0.4em] text-[10px] font-bold">
              Tap to Reveal
            </div>

            {/* Mobile Nav inside card */}
            <div className="absolute bottom-16 inset-x-0 flex md:hidden justify-between px-8">
               <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-primary/20"
                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-primary/20"
                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Back Side */}
          <Card className={cn(
            "absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col p-10",
            "bg-card border-2 border-primary/10 shadow-2xl rounded-3xl"
          )}>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-border/50">
              <span className="text-5xl font-headline font-black text-primary">{entry.number}</span>
              <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-40">Tersinkronisasi</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-70">Person</label>
                <p className="text-2xl font-headline font-bold text-foreground leading-tight">{entry.person}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-70">Action</label>
                <p className="text-2xl font-headline font-bold text-foreground leading-tight">{entry.action}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-70">Object</label>
                <p className="text-2xl font-headline font-bold text-foreground leading-tight">{entry.object}</p>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-border/30">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 block">Etymology</label>
              <p className="text-sm text-muted-foreground/80 italic font-medium leading-relaxed line-clamp-3">
                {entry.etymology}
              </p>
            </div>

            {/* Mobile Nav inside back card */}
            <div className="absolute bottom-4 inset-x-0 flex md:hidden justify-center gap-4">
               <Button 
                variant="ghost" 
                size="sm" 
                className="text-[10px] font-bold uppercase"
                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
              >
                Prev
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[10px] font-bold uppercase"
                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
              >
                Next
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
