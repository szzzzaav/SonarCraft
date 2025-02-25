interface GridCell {
  instrument: string;
  pitch: string;
  isActive: boolean;
}

interface GridProps {
  rows: number;
  cols: number;
  onCellClick: (
    position: number
  ) => void;
  cells: GridCell[];
}
