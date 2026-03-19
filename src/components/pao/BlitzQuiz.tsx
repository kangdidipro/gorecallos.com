"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAO_DATABASE, PAOEntry } from '@/lib/pao-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePAOStore } from '@/hooks/use-pao-store';
import { Timer, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type QuizState = 'START' | 'PLAYING' | 'RESULT';
type QuizLevel = 1 | 2 | 3;

export function BlitzQuiz() {
  const { toast } = useToast();
  const { neuralStrength, updateStrength } = usePAOStore();
  
  const [state, setState] = useState<QuizState>('START');
  const [level, setLevel] = useState<QuizLevel>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [questions, setQuestions] = useState<{ entry: PAOEntry; options: string[]; type: 'person' | 'action' | 'object' }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const playCorrectSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); 
    audio.play().catch(() => {});
  };

  const generateQuiz = useCallback(() => {
    let pool = PAO_DATABASE;
    if (level === 1) pool = PAO_DATABASE.slice(0, 10);
    if (level === 2) pool = PAO_DATABASE.slice(10, 20);

    const weightedPool = [...pool];
    Object.keys(neuralStrength).forEach(numStr => {
      const stats = neuralStrength[numStr];
      if (stats.strength < 50) {
        const entry = PAO_DATABASE.find(e => e.number === numStr);
        if (entry) weightedPool.push(entry, entry);
      }
    });

    const selectedEntries = Array.from({ length: 10 }).map(() => weightedPool[Math.floor(Math.random() * weightedPool.length)]);

    const quizQuestions = selectedEntries.map((entry) => {
      let type: 'person' | 'action' | 'object' = 'person';
      if (level === 2) type = Math.random() > 0.5 ? 'person' : 'action';
      if (level === 3) {
        const r = Math.random();
        type = r < 0.33 ? 'person' : r < 0.66 ? 'action' : 'object';
      }

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
  }, [level, neuralStrength]);

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
      if (answer !== '') {
        toast({
          title: "Salah!",
          description: `Angka ${currentQ.entry.number} seharusnya: ${correctAns}`,
          variant: "destructive"
        });
      } else {
         toast({
          title: "Waktu Habis!",
          description: `Angka ${currentQ.entry.number} adalah: ${correctAns}`,
          variant: "destructive"
        });
      }
    }

    // Delay 1 detik agar pengguna bisa melihat feedback visual
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
            className="text-center space-y-8 py-12"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold font-headline text-primary neon-glow">The Blitz Quiz</h2>
              <p className="text-muted-foreground">Uji refleks memori Anda di bawah tekanan waktu.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((l) => (
                <Button 
                  key={l}
                  variant={level === l ? "default" : "outline"}
                  className={cn(
                    "h-24 flex flex-col gap-1 border-2",
                    level === l ? "bg-primary text-black border-primary" : "border-primary/20 text-primary hover:bg-primary/10"
                  )}
                  onClick={() => setLevel(l as QuizLevel)}
                >
                  <span className="text-lg font-bold">Level {l}</span>
                  <span className="text-xs opacity-70">
                    {l === 1 ? "Tokoh (00-09)" : l === 2 ? "Tokoh & Aksi (10-19)" : "Campuran (Semua)"}
                  </span>
                </Button>
              ))}
            </div>

            <Button size="lg" className="w-full h-16 text-xl font-bold rounded-xl" onClick={generateQuiz}>
              MULAI BLITZ
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
              <span>Pertanyaan {currentIndex + 1} / {questions.length}</span>
              <span className="flex items-center gap-2 text-secondary">
                <Timer className="w-4 h-4" /> {timeLeft.toFixed(1)}s
              </span>
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
                      // Feedback visual
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
