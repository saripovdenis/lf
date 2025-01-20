'use client';

import useShapeStore, { ShapeType } from '../store/useShapeStore';
import { Square, Circle } from 'lucide-react';

export function ControlPanel() {
  const addShape = useShapeStore((state) => state.addShape);

  const handleAddShape = (type: ShapeType) => {
    addShape(type);
  };

  return (
    <div className="absolute top-4 left-4 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Controls</h2>
      <div className="flex flex-col space-y-3">
        <button
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          onClick={() => handleAddShape('rectangle')}
        >
          <Square className="mr-2" size={18} />
          <span>Add Rectangle</span>
        </button>
        <button
          className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
          onClick={() => handleAddShape('circle')}
        >
          <Circle className="mr-2" size={18} />
          <span>Add Circle</span>
        </button>
      </div>
    </div>
  );
}
