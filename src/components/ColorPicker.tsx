import React from 'react';
import { Wheel } from '@uiw/react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export default function ColorPicker({ color, onChange, onClose }: ColorPickerProps) {
  const presetColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1'];

  return (
    <div className="absolute bg-white p-4 rounded-lg shadow-lg border z-50">
      <div className="mb-4">
        <Wheel
          width={200}
          height={200}
          color={color}
          onChange={(color) => onChange(color.hex)}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              className="w-6 h-6 rounded-full border border-gray-300 transition-transform hover:scale-110"
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
            />
          ))}
        </div>
        
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-1 text-sm border rounded"
          placeholder="#000000"
        />
        
        <button
          onClick={onClose}
          className="w-full px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}