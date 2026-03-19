
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PAO_DATABASE } from '@/lib/pao-data';
import { Flashcard } from '@/components/pao/Flashcard';
import { BlitzQuiz } from '@/components/pao/BlitzQuiz';
import { NeuralProgress } from '@/components/pao/NeuralProgress';
import { usePAOStore } from '@/hooks/use-pao-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Zap, BarChart3, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MasterPAOPage() {
  const { neuralStrength } = usePAOStore();
  const [learningIndex, setLearningIndex] = useState(0);

  const currentEntry = PAO_DATABASE[learningIndex];
  const currentStrength = neuralStrength[currentEntry.number]?.strength || 0;
  
  const activatedCount = Object.keys(neuralStrength).length;
  const avgSync = activatedCount > 0 
    ? Math.round(Object.values(neuralStrength).reduce((a, b) => a + b.strength, 0) / activatedCount) 
    : 0;

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Simplified Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-8 py-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black font-headline text-primary neon-glow tracking-tighter italic">
              MASTER PAO
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold tracking-[0.5em] uppercase mt-1">
              Neural Memory Laboratory
            </p>
          </div>
          
          <div className="flex gap-8 items-center bg-muted/20 px-8 py-4 rounded-2xl border border-border/50">
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Active</p>
              <p className="text-2xl font-black text-primary font-headline">{activatedCount}/100</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Sync</p>
              <p className="text-2xl font-black text-secondary font-headline">{avgSync}%</p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="learn" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-muted/40 h-12 p-1 rounded-xl border border-border/50">
              <TabsTrigger value="learn" className="rounded-lg px-8 gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                <BookOpen className="w-4 h-4" /> Learn
              </TabsTrigger>
              <TabsTrigger value="quiz" className="rounded-lg px-8 gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                <Zap className="w-4 h-4" /> Blitz
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-lg px-8 gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                <BarChart3 className="w-4 h-4" /> Stats
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="learn" className="outline-none space-y-12">
            <div className="flex flex-col items-center gap-10">
              {/* Simple Navigation */}
              <div className="flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full w-12 h-12 hover:bg-primary/10"
                  onClick={() => setLearningIndex(prev => (prev === 0 ? 99 : prev - 1))}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <div className="flex items-center gap-2 px-6 py-2 bg-muted/30 rounded-full border border-border/50">
                  <Hash className="w-4 h-4 text-primary" />
                  <span className="text-lg font-black font-headline tracking-widest">{currentEntry.number}</span>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full w-12 h-12 hover:bg-primary/10"
                  onClick={() => setLearningIndex(prev => (prev === 99 ? 0 : prev + 1))}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              <motion.div
                key={learningIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Flashcard entry={currentEntry} strength={currentStrength} />
              </motion.div>

              {/* Minimal Grid */}
              <div className="flex flex-wrap justify-center gap-2 max-w-3xl px-4">
                {PAO_DATABASE.slice(Math.max(0, learningIndex - 10), Math.min(100, learningIndex + 11)).map((entry) => (
                  <button
                    key={entry.number}
                    onClick={() => setLearningIndex(PAO_DATABASE.indexOf(entry))}
                    className={cn(
                      "w-9 h-9 rounded-md text-xs font-black font-headline transition-all",
                      learningIndex === PAO_DATABASE.indexOf(entry)
                        ? "bg-primary text-black shadow-lg scale-110"
                        : "bg-muted/10 text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    {entry.number}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <BlitzQuiz />
          </TabsContent>

          <TabsContent value="stats">
            <div className="max-w-4xl mx-auto py-4">
              <NeuralProgress />
            </div>
          </TabsContent>
        </Tabs>

        <footer className="pt-24 pb-8 text-center text-[10px] text-muted-foreground font-bold tracking-[0.3em] uppercase opacity-30">
          Master PAO System &bull; High Performance Cognition
        </footer>
      </div>
    </main>
  );
}
