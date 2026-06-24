export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
  backlinks: string[];
  createdAt: number;
  updatedAt: number;
}

export interface GraphNode {
  id: string;
  title: string;
  radius: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  strength?: number;
}
