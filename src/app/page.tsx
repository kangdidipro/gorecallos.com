"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PAO_DATABASE } from '@/lib/pao-data';
import { Flashcard } from '@/components/pao/Flashcard';
import { BlitzQuiz } from '@/components/pao/BlitzQuiz';
import { NeuralProgress } from '@/components/pao/NeuralProgress';
import { usePAOStore } from '@/hooks/use-pao-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Zap, BarChart3, ChevronLeft, ChevronRight, Binary } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MasterPAOPage() {
  const { neuralStrength } = usePAOStore();
  const [learningIndex, setLearningIndex] = useState(0);

  const currentEntry = PAO_DATABASE[learningIndex];
  const currentStrength = neuralStrength[currentEntry.number]?.strength || 0;

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-black font-headline text-primary italic neon-glow tracking-tighter">
              MASTER PAO
            </h1>
            <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs mt-2">
              Laboratorium Memori Masa Depan <span className="text-secondary mx-2">|</span> 00-99 Level Insting
            </p>
          </div>
          <div className="flex gap-4 p-4 metallic-glass rounded-2xl border-primary/10">
            <div className="text-center px-4 border-r border-border">
              <span className="block text-2xl font-black text-primary font-headline">
                {Object.keys(neuralStrength).length}
              </span>
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Teraktivasi</span>
            </div>
            <div className="text-center px-4">
              <span className="block text-2xl font-black text-secondary font-headline">
                {Math.round(Object.values(neuralStrength).reduce((a, b) => a + b.strength, 0) / 100)}%
              </span>
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Neural Sync</span>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <Tabs defaultValue="learn" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-muted/30 border border-primary/20 h-14 p-1 rounded-xl">
              <TabsTrigger value="learn" className="data-[state=active]:bg-primary data-[state=active]:text-black h-full px-8 rounded-lg gap-2 font-bold">
                <BookOpen className="w-4 h-4" /> Mode Belajar
              </TabsTrigger>
              <TabsTrigger value="quiz" className="data-[state=active]:bg-primary data-[state=active]:text-black h-full px-8 rounded-lg gap-2 font-bold">
                <Zap className="w-4 h-4" /> The Blitz Quiz
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-black h-full px-8 rounded-lg gap-2 font-bold">
                <BarChart3 className="w-4 h-4" /> Neural Progress
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Learn Content */}
          <TabsContent value="learn" className="outline-none">
            <div className="flex flex-col items-center gap-8 py-8">
              <div className="flex items-center gap-4 w-full max-w-lg justify-between">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-12 w-12 border-primary/20"
                  onClick={() => setLearningIndex(prev => (prev === 0 ? 99 : prev - 1))}
                >
                  <ChevronLeft />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Binary className="w-5 h-5 text-primary" />
                  <span className="text-xl font-headline font-bold text-foreground">
                    NAVIGASI NEURAL
                  </span>
                </div>

                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-12 w-12 border-primary/20"
                  onClick={() => setLearningIndex(prev => (prev === 99 ? 0 : prev + 1))}
                >
                  <ChevronRight />
                </Button>
              </div>

              <motion.div
                key={learningIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Flashcard entry={currentEntry} strength={currentStrength} />
              </motion.div>

              <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                {PAO_DATABASE.slice(
                  Math.max(0, learningIndex - 5),
                  Math.min(100, learningIndex + 6)
                ).map((entry, idx) => (
                   <button
                    key={entry.number}
                    className={cn(
                      "w-10 h-10 rounded-lg font-headline font-bold text-sm transition-all",
                      learningIndex === PAO_DATABASE.indexOf(entry) 
                        ? "bg-primary text-black scale-110 shadow-[0_0_15px_rgba(222,255,154,0.5)]" 
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/40"
                    )}
                    onClick={() => setLearningIndex(PAO_DATABASE.indexOf(entry))}
                   >
                     {entry.number}
                   </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Quiz Content */}
          <TabsContent value="quiz" className="outline-none">
            <BlitzQuiz />
          </TabsContent>

          {/* Stats Content */}
          <TabsContent value="stats" className="outline-none">
             <div className="max-w-4xl mx-auto py-8">
                <NeuralProgress />
             </div>
          </TabsContent>
        </Tabs>

        {/* Footer info */}
        <footer className="pt-12 border-t border-border/50 text-center text-xs text-muted-foreground font-bold tracking-widest uppercase">
          Master PAO System &copy; 2024 <span className="mx-2">|</span> Designed for High-Performance Cognition
        </footer>
      </div>
    </main>
  );
}
