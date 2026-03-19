
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAO_DATABASE } from '@/lib/pao-data';
import { Flashcard } from '@/components/pao/Flashcard';
import { BlitzQuiz } from '@/components/pao/BlitzQuiz';
import { MemoryTest } from '@/components/pao/MemoryTest';
import { NeuralProgress } from '@/components/pao/NeuralProgress';
import { usePAOStore } from '@/hooks/use-pao-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Zap, BarChart3, Brain, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const TAB_INFO = {
  learn: {
    title: "Neural Encoding (Learn)",
    description: "Fase pengenalan untuk membangun asosiasi antara angka dan Person-Action-Object (PAO).",
    howTo: "Gunakan kartu flash untuk menghafal visualisasi. Klik kartu untuk melihat detail, dan gunakan navigasi untuk berpindah angka."
  },
  quiz: {
    title: "Reflex Response (Blitz)",
    description: "Latihan refleks cepat untuk menguji kecepatan asosiasi otak Anda terhadap sistem PAO.",
    howTo: "Pilih Person, Action, atau Object yang tepat untuk angka yang muncul sebelum waktu habis. Semakin cepat, semakin kuat koneksi neural Anda."
  },
  test: {
    title: "Memory Span (Test)",
    description: "Uji kapasitas penyimpanan data jangka pendek dengan urutan angka acak.",
    howTo: "Hafalkan angka yang muncul satu per satu. Setelah semua angka menghilang, masukkan kembali urutan angka tersebut dengan tepat."
  },
  stats: {
    title: "Neural Analytics (Stats)",
    description: "Pantau kemajuan sinkronisasi memori Anda berdasarkan data latihan nyata.",
    howTo: "Warna yang lebih terang menunjukkan angka yang sudah tersinkronisasi 100%. Pantau perbedaan kekuatan antara mode Blitz dan Test."
  }
};

export default function MasterPAOPage() {
  const { blitzStrength, testStrength } = usePAOStore();
  const [learningIndex, setLearningIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('learn');

  const currentEntry = PAO_DATABASE[learningIndex];
  const currentStrength = blitzStrength[currentEntry.number]?.strength || 0;
  
  const totalActivated = new Set([...Object.keys(blitzStrength), ...Object.keys(testStrength)]).size;
  
  const totalSync = [...Object.values(blitzStrength), ...Object.values(testStrength)];
  const avgSync = totalSync.length > 0 
    ? Math.round(totalSync.reduce((a, b) => a + b.strength, 0) / totalSync.length) 
    : 0;

  const handleNext = () => setLearningIndex((prev) => (prev === 99 ? 0 : prev + 1));
  const handlePrev = () => setLearningIndex((prev) => (prev === 0 ? 99 : prev - 1));

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
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
              <p className="text-2xl font-black text-primary font-headline">{totalActivated}/100</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Sync</p>
              <p className="text-2xl font-black text-secondary font-headline">{avgSync}%</p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="learn" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col items-center gap-6 mb-12">
            <TabsList className="bg-muted/40 h-12 p-1 rounded-xl border border-border/50">
              <TabsTrigger value="learn" className="rounded-lg px-6 md:px-8 gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                <BookOpen className="w-4 h-4" /> Learn
              </TabsTrigger>
              <TabsTrigger value="quiz" className="rounded-lg px-6 md:px-8 gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                <Zap className="w-4 h-4" /> Blitz
              </TabsTrigger>
              <TabsTrigger value="test" className="rounded-lg px-6 md:px-8 gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                <Brain className="w-4 h-4" /> Test
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-lg px-6 md:px-8 gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                <BarChart3 className="w-4 h-4" /> Stats
              </TabsTrigger>
            </TabsList>

            {/* Dynamic Info Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full max-w-2xl bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4 items-start"
              >
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                    {TAB_INFO[activeTab as keyof typeof TAB_INFO].title}
                  </h4>
                  <p className="text-xs text-foreground font-medium">
                    {TAB_INFO[activeTab as keyof typeof TAB_INFO].description}
                  </p>
                  <p className="text-[10px] text-muted-foreground italic">
                    <span className="font-bold uppercase not-italic mr-1">Cara Pakai:</span> 
                    {TAB_INFO[activeTab as keyof typeof TAB_INFO].howTo}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <TabsContent value="learn" className="outline-none space-y-12">
            <div className="flex flex-col items-center gap-12">
              <div className="relative w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={learningIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Flashcard 
                      entry={currentEntry} 
                      strength={currentStrength} 
                      onNext={handleNext}
                      onPrev={handlePrev}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quick Jump Grid */}
              <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl px-4">
                {PAO_DATABASE.slice(Math.max(0, learningIndex - 5), Math.min(100, learningIndex + 6)).map((entry) => (
                  <button
                    key={entry.number}
                    onClick={() => setLearningIndex(PAO_DATABASE.indexOf(entry))}
                    className={cn(
                      "w-8 h-8 rounded-md text-[10px] font-black font-headline transition-all",
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

          <TabsContent value="test">
            <MemoryTest />
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
