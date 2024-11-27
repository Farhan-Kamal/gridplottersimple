import React from 'react';
import { Point, PointGroup } from '../types';
import { X } from 'lucide-react';
import EditableCoordinate from './EditableCoordinate';

interface PointsListProps {
  points: Point[];
  groups: PointGroup[];
  selectedPoint: Point | null;
  onDeletePoint: (point: Point) => void;
  onAssignGroup: (point: Point, groupId: string) => void;
  onUpdatePoint: (oldPoint: Point, newPoint: Point) => void;
}

export default function PointsList({ 
  points, 
  groups, 
  selectedPoint, 
  onDeletePoint, 
  onAssignGroup,
  onUpdatePoint 
}: PointsListProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Points ({points.length})</h2>
      
      <div className="max-h-[540px] overflow-y-auto">
        {points.length === 0 ? (
          <p className="text-gray-500 text-sm">Click on the grid to add points</p>
        ) : (
          <ul className="space-y-2">
            {points.map((point, index) => (
              <li 
                key={index}
                className={`flex items-center justify-between p-2 rounded group
                  ${selectedPoint === point ? 'bg-blue-50 ring-1 ring-blue-500' : 'bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono">
                    (
                    <EditableCoordinate
                      value={point.x}
                      onChange={(newX) => onUpdatePoint(point, { ...point, x: newX })}
                    />
                    ,{' '}
                    <EditableCoordinate
                      value={point.y}
                      onChange={(newY) => onUpdatePoint(point, { ...point, y: newY })}
                    />
                    )
                  </span>
                  {point.groupId && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs text-white"
                      style={{ 
                        backgroundColor: groups.find(g => g.id === point.groupId)?.color 
                      }}
                    >
                      {groups.find(g => g.id === point.groupId)?.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {groups.length > 0 && (
                    <select
                      value={point.groupId || ''}
                      onChange={(e) => onAssignGroup(point, e.target.value)}
                      className="text-sm border rounded px-1 py-0.5"
                    >
                      <option value="">No group</option>
                      {groups.map(group => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => onDeletePoint(point)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}