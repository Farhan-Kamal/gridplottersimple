import React, { useState } from 'react';
import { GridSize, PointGroup } from '../types';
import { Trash2, Plus, X } from 'lucide-react';
import ModeToggle from './ModeToggle';

interface GridControlsProps {
  gridSize: GridSize;
  setGridSize: (size: GridSize) => void;
  onReset: () => void;
  onAddGroup: (name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  groups: PointGroup[];
  mode: 'add' | 'select';
  setMode: (mode: 'add' | 'select') => void;
}

export default function GridControls({ 
  gridSize, 
  setGridSize, 
  onReset, 
  onAddGroup,
  onDeleteGroup, 
  groups,
  mode,
  setMode
}: GridControlsProps) {
  const [newGroupName, setNewGroupName] = useState('');

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      onAddGroup(newGroupName.trim());
      setNewGroupName('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div>
          <label htmlFor="x-size" className="block text-sm font-medium text-gray-700">
            X-axis Size
          </label>
          <input
            type="number"
            id="x-size"
            value={gridSize.x}
            onChange={(e) => setGridSize({ ...gridSize, x: Math.max(1, parseInt(e.target.value) || 0) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            min="1"
          />
        </div>
        
        <div>
          <label htmlFor="y-size" className="block text-sm font-medium text-gray-700">
            Y-axis Size
          </label>
          <input
            type="number"
            id="y-size"
            value={gridSize.y}
            onChange={(e) => setGridSize({ ...gridSize, y: Math.max(1, parseInt(e.target.value) || 0) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            min="1"
          />
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
        >
          <Trash2 size={16} />
          Reset Grid
        </button>
      </div>

      <ModeToggle mode={mode} setMode={setMode} />

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label htmlFor="group-name" className="block text-sm font-medium text-gray-700">
            New Group Name
          </label>
          <input
            type="text"
            id="group-name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter group name"
          />
        </div>
        <button
          onClick={handleAddGroup}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Group
        </button>
      </div>

      {groups.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {groups.map(group => (
            <span
              key={group.id}
              className="px-2 py-1 rounded-full text-sm text-white flex items-center gap-1 group"
              style={{ backgroundColor: group.color }}
            >
              {group.name}
              <button
                onClick={() => onDeleteGroup(group.id)}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}