
"use client";

import { useState, useEffect } from 'react';

export interface NeuralStats {
  strength: number; // 0 to 100
  lastPracticed: string;
  errors: number;
  successes: number;
}

export interface NeuralStrengthMap {
  [key: string]: NeuralStats;
}

export function usePAOStore() {
  const [blitzStrength, setBlitzStrength] = useState<NeuralStrengthMap>({});
  const [testStrength, setTestStrength] = useState<NeuralStrengthMap>({});

  useEffect(() => {
    const savedBlitz = localStorage.getItem('pao_blitz_strength');
    if (savedBlitz) {
      setBlitzStrength(JSON.parse(savedBlitz));
    }
    const savedTest = localStorage.getItem('pao_test_strength');
    if (savedTest) {
      setTestStrength(JSON.parse(savedTest));
    }
  }, []);

  const updateStrength = (number: string, isCorrect: boolean, mode: 'blitz' | 'test') => {
    const setter = mode === 'blitz' ? setBlitzStrength : setTestStrength;
    const storageKey = mode === 'blitz' ? 'pao_blitz_strength' : 'pao_test_strength';

    setter((prev) => {
      const current = prev[number] || { strength: 0, lastPracticed: '', errors: 0, successes: 0 };
      
      const newSuccesses = isCorrect ? current.successes + 1 : current.successes;
      const newErrors = !isCorrect ? current.errors + 1 : current.errors;
      
      const total = newSuccesses + newErrors;
      const newStrength = Math.min(100, Math.round((newSuccesses / total) * 100));

      const updated = {
        ...prev,
        [number]: {
          strength: newStrength,
          lastPracticed: new Date().toISOString(),
          errors: newErrors,
          successes: newSuccesses,
        }
      };
      
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const resetProgress = (mode?: 'blitz' | 'test') => {
    if (!mode || mode === 'blitz') {
      localStorage.removeItem('pao_blitz_strength');
      setBlitzStrength({});
    }
    if (!mode || mode === 'test') {
      localStorage.removeItem('pao_test_strength');
      setTestStrength({});
    }
  };

  return { blitzStrength, testStrength, updateStrength, resetProgress };
}
