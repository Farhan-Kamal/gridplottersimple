import React, { useState } from 'react';
import { Point, PointGroup, SortType } from '../types';
import { X, Search, Filter, ArrowUpDown } from 'lucide-react';
import EditableCoordinate from './EditableCoordinate';
import ColorPicker from './ColorPicker';

interface PointsListProps {
  points: Point[];
  groups: PointGroup[];
  selectedPoint: Point | null;
  onDeletePoint: (point: Point) => void;
  onAssignGroup: (point: Point, groupId: string) => void;
  onUpdatePoint: (oldPoint: Point, newPoint: Point) => void;
  onUpdateGroupColor: (groupId: string, color: string) => void;
}

export default function PointsList({ 
  points, 
  groups, 
  selectedPoint, 
  onDeletePoint, 
  onAssignGroup,
  onUpdatePoint,
  onUpdateGroupColor
}: PointsListProps) {
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState<SortType>('timestamp');
  const [filterGroup, setFilterGroup] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const filteredPoints = points
    .filter(point => {
      const matchesSearch = search === '' || 
        `${point.x},${point.y}`.includes(search);
      const matchesGroup = filterGroup === '' || 
        point.groupId === filterGroup;
      return matchesSearch && matchesGroup;
    })
    .sort((a, b) => {
      if (sortType === 'coordinate') {
        return (a.x + a.y) - (b.x + b.y);
      } else if (sortType === 'group') {
        const groupA = a.groupId || '';
        const groupB = b.groupId || '';
        return groupA.localeCompare(groupB);
      }
      return (a.timestamp || 0) - (b.timestamp || 0);
    });

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Points ({points.length})</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coordinates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="p-2 border rounded-md"
            >
              <option value="timestamp">Oldest to Newest</option>
              <option value="coordinate">By Coordinate Size</option>
              <option value="group">By Group</option>
            </select>
            
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">All Groups</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filteredPoints.length === 0 ? (
            <p className="text-gray-500 text-sm">No points match your criteria</p>
          ) : (
            <ul className="space-y-2">
              {filteredPoints.map((point, index) => (
                <li 
                  key={index}
                  className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 group
                    ${selectedPoint && selectedPoint.x === point.x && selectedPoint.y === point.y 
                      ? 'bg-blue-50 ring-1 ring-blue-500' 
                      : 'bg-gray-50'}`}
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
                      <div className="relative">
                        <button
                          className="px-2 py-0.5 rounded-full text-xs text-white"
                          style={{ 
                            backgroundColor: groups.find(g => g.id === point.groupId)?.color 
                          }}
                          onClick={() => setShowColorPicker(point.groupId)}
                        >
                          {groups.find(g => g.id === point.groupId)?.name}
                        </button>
                        {showColorPicker === point.groupId && (
                          <div className="absolute z-10 mt-2">
                            <ColorPicker
                              color={groups.find(g => g.id === point.groupId)?.color || '#000000'}
                              onChange={(color) => {
                                onUpdateGroupColor(point.groupId!, color);
                                setShowColorPicker(null);
                              }}
                              onClose={() => setShowColorPicker(null)}
                            />
                          </div>
                        )}
                      </div>
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
    </div>
  );
}