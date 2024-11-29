export interface Point {
  x: number;
  y: number;
  groupId?: string;
  timestamp?: number;
  selected?: boolean;
}

export interface Line {
  start: Point;
  end: Point;
}

export interface GridSize {
  x: number;
  y: number;
}

export interface PointGroup {
  id: string;
  name: string;
  color: string;
}

export type Mode = 'add' | 'select';

export interface PointHistory {
  points: Point[];
  lines: Line[];
}

export type SortType = 'coordinate' | 'timestamp' | 'group';