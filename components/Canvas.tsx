'use client';

import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import Shape from './Shape';
import useShapeStore from '../store/useShapeStore';

export function Canvas() {
  const shapes = useShapeStore((state) => state.shapes);

  return (
    <div className="w-full h-full">
      <ThreeCanvas>
        <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={100} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {shapes.map((shape) => (
          <Shape key={shape.id} {...shape} />
        ))}
      </ThreeCanvas>
    </div>
  );
}
