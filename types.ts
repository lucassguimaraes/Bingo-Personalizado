export type CellContent = {
  id: string;
  type: 'text' | 'image';
  content: string; // text content or base64 image string
};

export type BingoCardData = Array<CellContent | null>;

export type GridSize = 3 | 4 | 5;

export type LineThickness = 'thin' | 'medium' | 'thick';

export type BingoSettings = {
  title: string;
  gridSize: GridSize;
  numCards: number;
  bgColor: string;
  textColor: string;
  lineColor: string;
  lineThickness: LineThickness;
  isCenterCellFree: boolean;
};