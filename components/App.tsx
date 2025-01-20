'use client';

import { Canvas } from './Canvas';
import { ControlPanel } from './ControlPanel';

export function App() {
  return (
    <div className="w-screen h-screen">
      <Canvas />
      <ControlPanel />
    </div>
  );
}
