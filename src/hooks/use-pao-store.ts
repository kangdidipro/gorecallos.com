
"use client";

import { useState, useEffect } from 'react';

export interface NeuralStrength {
  [key: string]: {
    strength: number; // 0 to 100
    lastPracticed: string;
    errors: number;
    successes: number;
  };
}

export function usePAOStore() {
  const [neuralStrength, setNeuralStrength] = useState<NeuralStrength>({});

  useEffect(() => {
    const saved = localStorage.getItem('pao_neural_strength');
    if (saved) {
      setNeuralStrength(JSON.parse(saved));
    }
  }, []);

  const updateStrength = (number: string, isCorrect: boolean) => {
    setNeuralStrength((prev) => {
      const current = prev[number] || { strength: 0, lastPracticed: '', errors: 0, successes: 0 };
      
      const newSuccesses = isCorrect ? current.successes + 1 : current.successes;
      const newErrors = !isCorrect ? current.errors + 1 : current.errors;
      
      // Basic strength calculation: ratio of successes over recent attempts
      // In a real app, use an SRS algorithm like Anki
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
      
      localStorage.setItem('pao_neural_strength', JSON.stringify(updated));
      return updated;
    });
  };

  return { neuralStrength, updateStrength };
}
