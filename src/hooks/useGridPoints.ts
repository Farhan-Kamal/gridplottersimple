import { useState } from 'react';
import { Point, Line, PointGroup, Mode } from '../types';

export function useGridPoints() {
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [groups, setGroups] = useState<PointGroup[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [mode, setMode] = useState<Mode>('add');

  const addPoint = (point: Point) => {
    setPoints((prev) => [...prev, point]);
  };

  const deletePoint = (pointToDelete: Point) => {
    setPoints((prev) => prev.filter(p => !(p.x === pointToDelete.x && p.y === pointToDelete.y)));
    setLines((prev) => prev.filter(line => 
      !(line.start.x === pointToDelete.x && line.start.y === pointToDelete.y) &&
      !(line.end.x === pointToDelete.x && line.end.y === pointToDelete.y)
    ));
    if (selectedPoint?.x === pointToDelete.x && selectedPoint?.y === pointToDelete.y) {
      setSelectedPoint(null);
    }
  };

  const updatePoint = (oldPoint: Point, newPoint: Point) => {
    setPoints((prev) => prev.map(p => 
      p.x === oldPoint.x && p.y === oldPoint.y ? newPoint : p
    ));
    
    setLines((prev) => prev.map(line => ({
      start: line.start.x === oldPoint.x && line.start.y === oldPoint.y ? newPoint : line.start,
      end: line.end.x === oldPoint.x && line.end.y === oldPoint.y ? newPoint : line.end
    })));

    if (selectedPoint?.x === oldPoint.x && selectedPoint?.y === oldPoint.y) {
      setSelectedPoint(newPoint);
    }
  };

  const resetGrid = () => {
    setPoints([]);
    setLines([]);
    setSelectedPoint(null);
  };

  const addGroup = (name: string) => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1'];
    const newGroup: PointGroup = {
      id: Date.now().toString(),
      name,
      color: colors[groups.length % colors.length]
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter(g => g.id !== groupId));
    setPoints((prev) => prev.map(point => 
      point.groupId === groupId ? { ...point, groupId: undefined } : point
    ));
  };

  const assignToGroup = (point: Point, groupId: string) => {
    setPoints((prev) => prev.map(p => 
      p.x === point.x && p.y === point.y ? { ...p, groupId } : p
    ));
  };

  const isSamePoint = (p1: Point, p2: Point) => {
    return p1.x === p2.x && p1.y === p2.y;
  };

  const handlePointClick = (point: Point) => {
    if (mode === 'select') {
      setSelectedPoint(selectedPoint && isSamePoint(selectedPoint, point) ? null : point);
    } else {
      if (selectedPoint) {
        if (!isSamePoint(selectedPoint, point)) {
          setLines((prev) => [...prev, { start: selectedPoint, end: point }]);
        }
        setSelectedPoint(null);
      } else {
        setSelectedPoint(point);
      }
    }
  };

  return {
    points,
    lines,
    groups,
    selectedPoint,
    mode,
    setMode,
    addPoint,
    deletePoint,
    updatePoint,
    resetGrid,
    addGroup,
    deleteGroup,
    assignToGroup,
    handlePointClick
  };
}