import React from 'react';
import { Mode } from '../types';
import { MousePointer, Plus } from 'lucide-react';

interface ModeToggleProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setMode('add')}
        className={`px-4 py-2 rounded-md flex items-center gap-2 ${
          mode === 'add'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Plus size={16} />
        Add Points
      </button>
      <button
        onClick={() => setMode('select')}
        className={`px-4 py-2 rounded-md flex items-center gap-2 ${
          mode === 'select'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <MousePointer size={16} />
        Select Points
      </button>
    </div>
  );
}