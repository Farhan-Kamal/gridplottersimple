import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Point } from '../types';
import { formatPoints } from '../utils/formatPoints';

interface ExportFormatProps {
  points: Point[];
}

export default function ExportFormat({ points }: ExportFormatProps) {
  const [format, setFormat] = useState('[coords{i}]');
  const [result, setResult] = useState('');

  const handleExport = () => {
    const formatted = formatPoints(points, format);
    setResult(formatted);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <h2 className="text-lg font-semibold">Export Points</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Format Template
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Example: [coords{i}]"
          />
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Use {'{i}'} for index, {'{x}'} for x coordinate, {'{y}'} for y coordinate
        </p>
      </div>

      {result && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Result
          </label>
          <textarea
            value={result}
            readOnly
            className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}