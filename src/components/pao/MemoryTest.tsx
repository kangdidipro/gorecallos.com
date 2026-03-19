
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Brain, Timer, RotateCcw, CheckCircle2, XCircle, Play, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

type TestState = 'START' | 'MEMORIZING' | 'RECALLING' | 'RESULT';

export function MemoryTest() {
  const [state, setState] = useState<TestState>('START');
  const [itemCount, setItemCount] = useState(5);
  const [displayTime, setDisplayTime] = useState(3); // seconds per number
  const [numbers, setNumbers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const startTest = () => {
    const generated = Array.from({ length: itemCount }).map(() => 
      Math.floor(Math.random() * 100).toString().padStart(2, '0')
    );
    setNumbers(generated);
    setUserInputs(new Array(itemCount).fill(''));
    setCurrentIndex(0);
    setTimeLeft(displayTime);
    setState('MEMORIZING');
  };

  // Timer for Memorizing phase
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === 'MEMORIZING') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
      } else {
        if (currentIndex < numbers.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setTimeLeft(displayTime);
        } else {
          setState('RECALLING');
        }
      }
    }
    return () => clearTimeout(timer);
  }, [state, timeLeft, currentIndex, numbers.length, displayTime]);

  const handleRecall = () => {
    let correctCount = 0;
    userInputs.forEach((input, idx) => {
      if (input === numbers[idx]) correctCount++;
    });
    setScore(correctCount);
    setState('RESULT');
  };

  const updateInput = (val: string, idx: number) => {
    const newInputs = [...userInputs];
    newInputs[idx] = val.slice(0, 2).replace(/\D/g, '');
    setUserInputs(newInputs);
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
            className="text-center space-y-8 py-4"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold font-headline text-primary neon-glow flex items-center justify-center gap-3">
                <Brain className="w-10 h-10" /> Memory Span
              </h2>
              <p className="text-muted-foreground text-sm italic">Uji kapasitas penyimpanan data otak Anda.</p>
            </div>

            <div className="space-y-6 bg-muted/10 p-6 rounded-xl border border-border/50">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Jumlah Angka</Label>
                  <span className="text-primary font-black font-headline text-lg">{itemCount}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5" 
                  value={itemCount} 
                  onChange={(e) => setItemCount(parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground/50">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Durasi Per Angka</Label>
                  <span className="text-secondary font-black font-headline text-lg">{displayTime}s</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={displayTime} 
                  onChange={(e) => setDisplayTime(parseInt(e.target.value))}
                  className="w-full accent-secondary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground/50">
                  <span>1s</span>
                  <span>10s</span>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full h-16 text-xl font-bold rounded-xl shadow-2xl gap-3" onClick={startTest}>
              <Play className="w-6 h-6" /> INITIATE TEST
            </Button>
          </motion.div>
        )}

        {state === 'MEMORIZING' && (
          <motion.div key="memorizing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Item {currentIndex + 1} / {numbers.length}
              </div>
              <Progress value={(timeLeft / displayTime) * 100} className="h-1.5 w-48 bg-muted" />
            </div>

            <motion.div 
              key={currentIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[12rem] md:text-[15rem] font-black font-headline text-primary neon-glow leading-none"
            >
              {numbers[currentIndex]}
            </motion.div>

            <div className="flex items-center justify-center gap-2 text-secondary animate-pulse">
              <Eye className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Memorizing...</span>
            </div>
          </motion.div>
        )}

        {state === 'RECALLING' && (
          <motion.div key="recalling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold font-headline text-primary">Recall Phase</h3>
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Masukkan urutan angka yang Anda lihat</p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
              {userInputs.map((val, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold">{idx + 1}</span>
                  <Input 
                    value={val}
                    onChange={(e) => updateInput(e.target.value, idx)}
                    placeholder="--"
                    className="h-12 text-center font-bold text-lg bg-muted/20 border-border/50 focus:border-primary"
                    maxLength={2}
                  />
                </div>
              ))}
            </div>

            <Button size="lg" className="w-full h-16 text-xl font-bold" onClick={handleRecall}>
              SUBMIT ANSWERS
            </Button>
          </motion.div>
        )}

        {state === 'RESULT' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-8">
            <div className="space-y-4">
              <div className="text-6xl font-black text-primary font-headline neon-glow">
                {Math.round((score / numbers.length) * 100)}%
              </div>
              <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm">
                Accuracy: {score} / {numbers.length}
              </p>
            </div>

            <div className="space-y-4 bg-muted/5 p-6 rounded-2xl border border-border/30 max-h-[300px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 text-left">
                {numbers.map((num, idx) => (
                  <div key={idx} className={cn(
                    "p-3 rounded-lg border flex justify-between items-center",
                    userInputs[idx] === num ? "bg-primary/10 border-primary/20" : "bg-destructive/10 border-destructive/20"
                  )}>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-muted-foreground">#{idx + 1}</span>
                      <span className="font-bold">{num}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-bold", userInputs[idx] === num ? "text-primary" : "text-destructive")}>
                        {userInputs[idx] || "--"}
                      </span>
                      {userInputs[idx] === num ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-destructive" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 h-12 gap-2" onClick={() => setState('START')}>
                <RotateCcw className="w-4 h-4" /> RETRY
              </Button>
              <Button className="flex-1 h-12" onClick={() => setState('START')}>
                BACK TO MENU
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
