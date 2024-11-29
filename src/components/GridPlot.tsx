import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGridPoints } from '../hooks/useGridPoints';
import { Point } from '../types';
import GridControls from './GridControls';
import PointsList from './PointsList';
import ExportFormat from './ExportFormat';

export default function GridPlot() {
  const [gridSize, setGridSize] = useState({ x: 200, y: 200 });
  const {
    points,
    lines,
    groups,
    selectedPoints,
    mode,
    setMode,
    addPoint,
    deletePoint,
    updatePoint,
    resetGrid,
    addGroup,
    updateGroupColor,
    deleteGroup,
    assignToGroup,
    togglePointSelection,
    selectAllPoints,
    undo,
    redo
  } = useGridPoints();

  // Keyboard shortcuts
  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault();
    undo();
  });

  useHotkeys('ctrl+shift+z, cmd+shift+z', (e) => {
    e.preventDefault();
    redo();
  });

  useHotkeys('ctrl+a, cmd+a', (e) => {
    e.preventDefault();
    selectAllPoints();
  });

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (gridSize.x / rect.width));
    const y = Math.round((e.clientY - rect.top) * (gridSize.y / rect.height));
    
    if (x >= 0 && x <= gridSize.x && y >= 0 && y <= gridSize.y) {
      const clickedPoint = points.find(p => p.x === x && p.y === y);
      if (clickedPoint) {
        if (mode === 'select') {
          togglePointSelection(clickedPoint, e.shiftKey);
        }
      } else if (mode === 'add') {
        addPoint({ x, y, timestamp: Date.now() });
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Grid Plotting App</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GridControls 
            gridSize={gridSize} 
            setGridSize={setGridSize}
            onReset={resetGrid}
            onAddGroup={addGroup}
            onDeleteGroup={deleteGroup}
            groups={groups}
            mode={mode}
            setMode={setMode}
            onUndo={undo}
            onRedo={redo}
          />
          
          <div 
            className={`mt-4 border-2 border-gray-300 rounded-lg relative bg-white ${
              mode === 'add' ? 'cursor-crosshair' : 'cursor-pointer'
            }`}
            style={{ height: '600px' }}
            onClick={handleGridClick}
          >
            {/* Grid lines */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${100 / (gridSize.x / 20)}% ${100 / (gridSize.y / 20)}%`
            }} />

            {/* Lines */}
            {lines.map((line, index) => (
              <svg
                key={`line-${index}`}
                className="absolute inset-0 pointer-events-none"
                style={{ width: '100%', height: '100%' }}
              >
                <line
                  x1={`${(line.start.x / gridSize.x) * 100}%`}
                  y1={`${(line.start.y / gridSize.y) * 100}%`}
                  x2={`${(line.end.x / gridSize.x) * 100}%`}
                  y2={`${(line.end.y / gridSize.y) * 100}%`}
                  stroke="#6B7280"
                  strokeWidth="2"
                />
              </svg>
            ))}

            {/* Points */}
            {points.map((point, index) => (
              <div
                key={index}
                className={`absolute w-4 h-4 -translate-x-2 -translate-y-2 cursor-pointer
                  hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all
                  ${point.selected ? 'ring-2 ring-offset-2 ring-blue-500 scale-125' : ''}`}
                style={{
                  left: `${(point.x / gridSize.x) * 100}%`,
                  top: `${(point.y / gridSize.y) * 100}%`,
                  backgroundColor: point.groupId 
                    ? groups.find(g => g.id === point.groupId)?.color 
                    : '#3B82F6',
                  borderRadius: '50%'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (mode === 'select') {
                    togglePointSelection(point, e.shiftKey);
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <PointsList 
            points={points}
            groups={groups}
            selectedPoint={selectedPoints[0]}
            onDeletePoint={deletePoint}
            onAssignGroup={assignToGroup}
            onUpdatePoint={updatePoint}
            onUpdateGroupColor={updateGroupColor}
          />
          <ExportFormat points={points} />
        </div>
      </div>
    </div>
  );
}