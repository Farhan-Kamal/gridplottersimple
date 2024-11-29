import { useState, useCallback } from 'react';
import { Point, Line, PointGroup, Mode, PointHistory } from '../types';

export function useGridPoints() {
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [groups, setGroups] = useState<PointGroup[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<Point[]>([]);
  const [mode, setMode] = useState<Mode>('add');
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((newPoints: Point[], newLines: Line[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ points: [...newPoints], lines: [...newLines] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setPoints([...prevState.points]);
      setLines([...prevState.lines]);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setPoints([...nextState.points]);
      setLines([...nextState.lines]);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const addPoint = (point: Point) => {
    const newPoints = [...points, { ...point, selected: false }];
    setPoints(newPoints);
    addToHistory(newPoints, lines);
  };

  const deletePoint = (pointToDelete: Point) => {
    const newPoints = points.filter(p => !isSamePoint(p, pointToDelete));
    const newLines = lines.filter(line => 
      !isSamePoint(line.start, pointToDelete) && !isSamePoint(line.end, pointToDelete)
    );
    
    setPoints(newPoints);
    setLines(newLines);
    setSelectedPoints(selectedPoints.filter(p => !isSamePoint(p, pointToDelete)));
    addToHistory(newPoints, newLines);
  };

  const updatePoint = (oldPoint: Point, newPoint: Point) => {
    const newPoints = points.map(p => 
      isSamePoint(p, oldPoint) ? { ...newPoint, selected: p.selected } : p
    );
    
    const newLines = lines.map(line => ({
      start: isSamePoint(line.start, oldPoint) ? newPoint : line.start,
      end: isSamePoint(line.end, oldPoint) ? newPoint : line.end
    }));

    setPoints(newPoints);
    setLines(newLines);
    setSelectedPoints(selectedPoints.map(p => 
      isSamePoint(p, oldPoint) ? newPoint : p
    ));
    addToHistory(newPoints, newLines);
  };

  const resetGrid = () => {
    setPoints([]);
    setLines([]);
    setSelectedPoints([]);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const addGroup = (name: string, color: string) => {
    const newGroup: PointGroup = {
      id: Date.now().toString(),
      name,
      color
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const updateGroupColor = (groupId: string, color: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, color } : group
    ));
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter(g => g.id !== groupId));
    setPoints((prev) => prev.map(point => 
      point.groupId === groupId ? { ...point, groupId: undefined } : point
    ));
  };

  const assignToGroup = (point: Point | Point[], groupId: string) => {
    const pointsToUpdate = Array.isArray(point) ? point : [point];
    const newPoints = points.map(p => 
      pointsToUpdate.some(selected => isSamePoint(selected, p))
        ? { ...p, groupId }
        : p
    );
    setPoints(newPoints);
    addToHistory(newPoints, lines);
  };

  const isSamePoint = (p1: Point, p2: Point) => {
    return p1.x === p2.x && p1.y === p2.y;
  };

  const togglePointSelection = (point: Point, isShiftKey: boolean) => {
    const newPoints = points.map(p => ({
      ...p,
      selected: isSamePoint(p, point) 
        ? isShiftKey ? !p.selected : true
        : isShiftKey ? p.selected : false
    }));
    
    setPoints(newPoints);
    setSelectedPoints(newPoints.filter(p => p.selected));
  };

  const selectAllPoints = () => {
    const newPoints = points.map(p => ({ ...p, selected: true }));
    setPoints(newPoints);
    setSelectedPoints(newPoints);
  };

  const clearSelection = () => {
    const newPoints = points.map(p => ({ ...p, selected: false }));
    setPoints(newPoints);
    setSelectedPoints([]);
  };

  return {
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
    clearSelection,
    undo,
    redo
  };
}