
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAO_DATABASE, PAOEntry } from '@/lib/pao-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePAOStore } from '@/hooks/use-pao-store';
import { 
  Timer, X, CheckCircle2, AlertCircle, Zap, BrainCircuit,
  ShieldCheck, Trophy, Globe, Briefcase, Users, Moon, Flame, Landmark, Mic, Scroll 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type QuizState = 'START' | 'PLAYING' | 'RESULT';

const LEVEL_CONFIG: Record<number, { theme: string; icon: any }> = {
  1: { theme: "Karakter & Hero", icon: ShieldCheck },
  2: { theme: "Sport & Sepakbola", icon: Trophy },
  3: { theme: "Budaya & Sejarah", icon: Globe },
  4: { theme: "Religi & Profesi", icon: Briefcase },
  5: { theme: "Tokoh & Dunia", icon: Users },
  6: { theme: "Sejarah Islam", icon: Moon },
  7: { theme: "Modern & Krisis", icon: Flame },
  8: { theme: "Politik Dunia", icon: Landmark },
  9: { theme: "Tragedi & Idola", icon: Mic },
  10: { theme: "Reformasi & Era", icon: Scroll },
};

const SPEEDS = [
  { label: 'Sangat Lambat', value: 15 },
  { label: 'Lambat', value: 10 },
  { label: 'Normal', value: 5 },
  { label: 'Cepat', value: 3 },
  { label: 'Sangat Cepat', value: 1.5 },
];

const QUESTION_OPTIONS = [10, 20, 30, 40, 50];

export function BlitzQuiz() {
  const { blitzStrength, updateStrength } = usePAOStore();
  
  const [state, setState] = useState<QuizState>('START');
  const [selectedLevels, setSelectedLevels] = useState<number[]>([1]);
  const [duration, setDuration] = useState(5);
  const [questionCount, setQuestionCount] = useState(10);
  const [customCount, setCustomCount] = useState("");
  const [focusUnmastered, setFocusUnmastered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [questions, setQuestions] = useState<{ entry: PAOEntry; options: string[]; type: 'person' | 'action' | 'object' }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const toggleLevel = (lvl: number) => {
    setSelectedLevels(prev => 
      prev.includes(lvl) 
        ? prev.filter(l => l !== lvl)
        : [...prev, lvl].sort((a, b) => a - b)
    );
  };

  const selectAll = () => setSelectedLevels([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const unselectAll = () => setSelectedLevels([]);

  const generateQuiz = useCallback(() => {
    if (selectedLevels.length === 0) return;

    let pool: PAOEntry[] = [];
    selectedLevels.forEach(lvl => {
      const start = (lvl - 1) * 10;
      const end = lvl * 10;
      pool = [...pool, ...PAO_DATABASE.slice(start, end)];
    });

    if (focusUnmastered) {
      pool = pool.filter(entry => {
        const stats = blitzStrength[entry.number];
        return !stats || stats.strength < 100;
      });

      if (pool.length === 0) {
        toast({
          variant: "destructive",
          title: "Level Selesai!",
          description: "Semua angka di level ini sudah mencapai 100% Neural Sync pada mode Blitz.",
        });
        return;
      }
    }

    let finalCount = questionCount;
    if (customCount && !isNaN(parseInt(customCount))) {
      finalCount = Math.max(1, parseInt(customCount));
    }
    
    if (focusUnmastered) {
      finalCount = Math.min(finalCount, pool.length);
    }

    const quizQuestions = Array.from({ length: finalCount }).map(() => {
      const entry = pool[Math.floor(Math.random() * pool.length)];
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
    setTimeLeft(duration);
    setSelectedOption(null);
    setIsChecking(false);
    setState('PLAYING');
  }, [selectedLevels, blitzStrength, duration, questionCount, customCount, focusUnmastered]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === 'PLAYING' && timeLeft > 0 && !isChecking) {
      timer = setTimeout(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
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
      updateStrength(currentQ.entry.number, true, 'blitz');
    } else {
      updateStrength(currentQ.entry.number, false, 'blitz');
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(duration);
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
            className="text-center space-y-8 py-4"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold font-headline text-primary neon-glow">The Blitz Quiz</h2>
              <p className="text-muted-foreground text-sm">Sesuaikan konfigurasi latihan Anda.</p>
            </div>

            {/* Level Configuration */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">1. Pilih Level Angka</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-primary h-auto p-1" onClick={selectAll}>Pilih Semua</Button>
                  <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-destructive h-auto p-1" onClick={unselectAll}>Hapus Semua</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => {
                  const Config = LEVEL_CONFIG[l];
                  const Icon = Config.icon;
                  return (
                    <Button 
                      key={l}
                      variant="outline"
                      className={cn(
                        "h-28 flex flex-col items-center justify-center border-2 transition-all p-2 gap-1 group relative overflow-hidden",
                        selectedLevels.includes(l) ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(222,255,154,0.3)]" : "border-primary/10 text-muted-foreground hover:border-primary/30"
                      )}
                      onClick={() => toggleLevel(l)}
                    >
                      <Icon className={cn("w-6 h-6 mb-1 transition-transform group-hover:scale-110", selectedLevels.includes(l) ? "text-black" : "text-primary/40")} />
                      <span className="text-[9px] font-black font-headline uppercase opacity-60">LV {l}</span>
                      <span className="text-[10px] font-black text-center leading-tight h-8 flex items-center">{Config.theme}</span>
                      <span className="text-[9px] opacity-60 font-bold mt-auto">{(l-1)*10}-{l*10-1}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Special Feature: Neural Focus */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <Label htmlFor="neural-focus" className="text-sm font-bold block">Fokus Neural</Label>
                  <p className="text-[10px] text-muted-foreground">Hanya latih angka yang belum 100%.</p>
                </div>
              </div>
              <Switch id="neural-focus" checked={focusUnmastered} onCheckedChange={setFocusUnmastered} />
            </div>

            {/* Speed Configuration */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-left px-2">2. Kecepatan Refleks</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SPEEDS.map((s) => (
                  <Button
                    key={s.value}
                    variant="outline"
                    className={cn(
                      "h-12 text-[10px] font-bold uppercase border-2",
                      duration === s.value ? "bg-secondary text-black border-secondary" : "border-secondary/10 text-muted-foreground"
                    )}
                    onClick={() => setDuration(s.value)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Question Count Configuration */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-left px-2">3. Jumlah Pertanyaan</p>
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {QUESTION_OPTIONS.map((count) => (
                    <Button
                      key={count}
                      variant="outline"
                      className={cn(
                        "h-10 text-[11px] font-bold border-2",
                        questionCount === count && !customCount ? "bg-primary text-black border-primary" : "border-primary/10 text-muted-foreground"
                      )}
                      onClick={() => { setQuestionCount(count); setCustomCount(""); }}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
                <Input 
                  type="number"
                  placeholder="Masukkan jumlah kustom..."
                  className="bg-muted/20 border-border/50 text-center h-12 font-bold"
                  value={customCount}
                  onChange={(e) => { setCustomCount(e.target.value); setQuestionCount(0); }}
                />
              </div>
            </div>

            <Button size="lg" className="w-full h-16 text-xl font-bold rounded-xl shadow-2xl" onClick={generateQuiz} disabled={selectedLevels.length === 0}>
              {selectedLevels.length === 0 ? "PILIH LEVEL DULU" : `MULAI BLITZ`}
            </Button>
          </motion.div>
        )}

        {state === 'PLAYING' && (
          <motion.div key="playing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <span>Q {currentIndex + 1} / {questions.length}</span>
              <div className="flex items-center gap-4">
                <span className={cn("flex items-center gap-2", timeLeft < 2 ? "text-destructive animate-pulse" : "text-secondary")}>
                  <Timer className="w-4 h-4" /> {timeLeft.toFixed(1)}s
                </span>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => setState('START')}><X className="w-4 h-4" /></Button>
              </div>
            </div>
            <Progress value={(timeLeft / duration) * 100} className="h-2 bg-muted" />
            <div className="text-center py-8">
              <div className="text-8xl font-black font-headline text-primary neon-glow mb-4">{questions[currentIndex].entry.number}</div>
              <div className="text-xl font-medium text-secondary italic">
                {questions[currentIndex].type === 'person' ? 'Siapakah Tokohnya?' : questions[currentIndex].type === 'action' ? 'Apakah Aksinya?' : 'Apakah Bendanya?'}
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
                      "h-16 text-lg border-2 transition-all",
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
          <motion.div key="result" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-12">
            <div className="relative inline-block">
              {score > (questions.length * 0.7) ? <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-4" /> : <AlertCircle className="w-24 h-24 text-secondary mx-auto mb-4" />}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Sesi Selesai!</h2>
              <div className="text-6xl font-black text-primary font-headline">{score} / {questions.length}</div>
            </div>
            <Button size="lg" className="w-full h-16 text-xl font-bold" onClick={() => setState('START')}>KEMBALI KE MENU</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
