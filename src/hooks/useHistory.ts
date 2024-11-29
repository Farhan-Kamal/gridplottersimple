import { useState, useCallback } from 'react';
import { Point, Line } from '../types';

interface HistoryState {
  points: Point[];
  lines: Line[];
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryState[]>([{ points: [], lines: [] }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback((points: Point[], lines: Line[]) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push({ points: [...points], lines: [...lines] });
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [history, currentIndex]);

  const reset = useCallback(() => {
    setHistory([{ points: [], lines: [] }]);
    setCurrentIndex(0);
  }, []);

  return { pushState, undo, redo, reset };
}