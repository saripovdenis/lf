import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ShapeType = 'rectangle' | 'circle';

export interface Shape {
  id: string;
  type: ShapeType;
  position: [number, number];
  size: [number, number];
  color: string;
}

interface ShapeStore {
  shapes: Shape[];
  selectedShape: string | null;
  addShape: (type: ShapeType) => void;
  updateShapePosition: (id: string, position: [number, number]) => void;
  selectShape: (id: string | null) => void;
  getShapes: () => Shape[];
}

const useShapeStore = create<ShapeStore>((set, get) => ({
  shapes: [],
  selectedShape: null,
  addShape: (type) =>
    set((state) => ({
      shapes: [
        ...state.shapes,
        {
          id: uuidv4(),
          type,
          position: [0, 0],
          size: type === 'rectangle' ? [1, 1] : [0.5, 0.5],
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    })),
  updateShapePosition: (id, position) =>
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id ? { ...shape, position } : shape
      ),
    })),
  selectShape: (id) => set({ selectedShape: id }),
  getShapes: () => get().shapes,
}));

export default useShapeStore;
