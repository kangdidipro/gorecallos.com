
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAO_DATABASE, PAOEntry } from '@/lib/pao-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePAOStore } from '@/hooks/use-pao-store';
import { Timer, Trophy, X, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuizState = 'START' | 'PLAYING' | 'RESULT';

export function BlitzQuiz() {
  const { neuralStrength, updateStrength } = usePAOStore();
  
  const [state, setState] = useState<QuizState>('START');
  const [selectedLevels, setSelectedLevels] = useState<number[]>([1]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [questions, setQuestions] = useState<{ entry: PAOEntry; options: string[]; type: 'person' | 'action' | 'object' }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const toggleLevel = (lvl: number) => {
    setSelectedLevels(prev => 
      prev.includes(lvl) 
        ? (prev.length > 1 ? prev.filter(l => l !== lvl) : prev) 
        : [...prev, lvl].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setSelectedLevels([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  };

  const playCorrectSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); 
    audio.play().catch(() => {});
  };

  const generateQuiz = useCallback(() => {
    let pool: PAOEntry[] = [];
    selectedLevels.forEach(lvl => {
      const start = (lvl - 1) * 10;
      const end = lvl * 10;
      pool = [...pool, ...PAO_DATABASE.slice(start, end)];
    });

    if (pool.length === 0) return;

    // Add weights for weak entries
    const weightedPool = [...pool];
    Object.keys(neuralStrength).forEach(numStr => {
      const stats = neuralStrength[numStr];
      if (stats.strength < 50) {
        const entry = pool.find(e => e.number === numStr);
        if (entry) weightedPool.push(entry, entry);
      }
    });

    const selectedEntries = Array.from({ length: 10 }).map(() => weightedPool[Math.floor(Math.random() * weightedPool.length)]);

    const quizQuestions = selectedEntries.map((entry) => {
      const types: ('person' | 'action' | 'object')[] = ['person', 'action', 'object'];
      const type = types[Math.floor(Math.random() * types.length)];

      const correctAns = entry[type];
      const distractorPool = PAO_DATABASE.filter(e => e.number !== entry.number).map(e => e[type]);
      const shuffledDistractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [correctAns, ...shuffledDistractors].sort(() => 0.5 - Math.random());

      return { entry, options, type };
    });

    setQuestions(quizQuestions);
    setScore(0);
    setCurrentIndex(0);
    setTimeLeft(5);
    setSelectedOption(null);
    setIsChecking(false);
    setState('PLAYING');
  }, [selectedLevels, neuralStrength]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === 'PLAYING' && timeLeft > 0 && !isChecking) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 0.1), 100);
    } else if (state === 'PLAYING' && timeLeft <= 0 && !isChecking) {
      handleAnswer('');
    }
    return () => clearTimeout(timer);
  }, [state, timeLeft, isChecking]);

  const handleAnswer = (answer: string) => {
    if (isChecking) return;

    setIsChecking(true);
    setSelectedOption(answer);

    const currentQ = questions[currentIndex];
    const correctAns = currentQ.entry[currentQ.type];
    const isCorrect = answer === correctAns;

    if (isCorrect) {
      setScore(prev => prev + 1);
      playCorrectSound();
      updateStrength(currentQ.entry.number, true);
    } else {
      updateStrength(currentQ.entry.number, false);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(5);
        setSelectedOption(null);
        setIsChecking(false);
      } else {
        setState('RESULT');
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 metallic-glass rounded-2xl border-primary/20">
      <AnimatePresence mode="wait">
        {state === 'START' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-8 py-8"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold font-headline text-primary neon-glow">The Blitz Quiz</h2>
              <p className="text-muted-foreground">Pilih level (rentang angka) yang ingin dilatih.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Select Levels</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[10px] font-bold uppercase text-primary hover:text-primary/80"
                  onClick={selectAll}
                >
                  Pilih Semua Level
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => {
                  const isSelected = selectedLevels.includes(l);
                  const rangeStart = (l - 1) * 10;
                  const rangeEnd = rangeStart + 9;
                  
                  return (
                    <Button 
                      key={l}
                      variant="outline"
                      className={cn(
                        "h-16 flex flex-col items-center justify-center border-2 transition-all p-0",
                        isSelected 
                          ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(222,255,154,0.3)]" 
                          : "border-primary/10 text-muted-foreground hover:border-primary/40"
                      )}
                      onClick={() => toggleLevel(l)}
                    >
                      <span className="text-xs font-black font-headline">LV {l}</span>
                      <span className="text-[9px] opacity-60 font-bold">{rangeStart.toString().padStart(2, '0')}-{rangeEnd.toString().padStart(2, '0')}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button size="lg" className="w-full h-16 text-xl font-bold rounded-xl shadow-2xl" onClick={generateQuiz}>
              MULAI BLITZ ({selectedLevels.length} Level)
            </Button>
          </motion.div>
        )}

        {state === 'PLAYING' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <span>Q {currentIndex + 1} / {questions.length}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-secondary">
                  <Timer className="w-4 h-4" /> {timeLeft.toFixed(1)}s
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-full hover:bg-destructive/10 text-destructive"
                  onClick={() => setState('START')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Progress value={(timeLeft / 5) * 100} className="h-2 bg-muted overflow-hidden">
               <div className="h-full bg-primary" />
            </Progress>

            <div className="text-center py-8">
              <div className="text-8xl font-black font-headline text-primary neon-glow mb-4">
                {questions[currentIndex].entry.number}
              </div>
              <div className="text-xl font-medium text-secondary italic">
                Siapakah {questions[currentIndex].type === 'person' ? 'Tokohnya' : questions[currentIndex].type === 'action' ? 'Aksinya' : 'Bendanya'}?
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {questions[currentIndex].options.map((option, idx) => {
                const isCorrect = option === questions[currentIndex].entry[questions[currentIndex].type];
                const isSelected = option === selectedOption;
                
                return (
                  <Button
                    key={idx}
                    variant="outline"
                    disabled={isChecking}
                    className={cn(
                      "h-16 text-lg border-2 transition-all text-left px-6",
                      !isChecking && "border-primary/20 hover:border-primary hover:bg-primary/5",
                      isChecking && isCorrect && "bg-primary/20 border-primary text-primary neon-glow",
                      isChecking && isSelected && !isCorrect && "bg-destructive/20 border-destructive text-destructive",
                      isChecking && !isSelected && !isCorrect && "opacity-30"
                    )}
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}

        {state === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-12"
          >
            <div className="relative inline-block">
              <Trophy className="w-24 h-24 text-secondary mx-auto mb-4" />
              <div className="absolute inset-0 blur-3xl bg-secondary/20 rounded-full" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Sesi Selesai!</h2>
              <div className="text-6xl font-black text-primary font-headline">
                {score} / {questions.length}
              </div>
              <p className="text-muted-foreground">
                {score === questions.length ? "Luar biasa! Insting Anda tajam." : "Terus berlatih untuk mencapai level insting."}
              </p>
            </div>

            <Button size="lg" className="w-full h-16 text-xl font-bold" onClick={() => setState('START')}>
              KEMBALI KE MENU
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
