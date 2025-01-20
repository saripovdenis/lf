'use client';

import { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { Shape as ShapeType } from '../store/useShapeStore';
import useShapeStore from '../store/useShapeStore';
import * as THREE from 'three';

const SNAP_THRESHOLD = 0.1;
const GRID_COLOR = 'rgba(255, 0, 0, 0.5)';

export default function Shape({ id, type, position, size, color }: ShapeType) {
  const ref = useRef<THREE.Mesh>(null);
  const { size: canvasSize, camera } = useThree();
  const updateShapePosition = useShapeStore(
    (state) => state.updateShapePosition
  );
  const selectShape = useShapeStore((state) => state.selectShape);
  const selectedShape = useShapeStore((state) => state.selectedShape);
  const getShapes = useShapeStore((state) => state.getShapes);

  const [snapLines, setSnapLines] = useState<
    [number, number, number, number][]
  >([]);

  const getEdges = (pos: [number, number], shapeSize: [number, number]) => {
    return {
      left: pos[0],
      right: pos[0] + shapeSize[0],
      top: pos[1] + shapeSize[1],
      bottom: pos[1],
      centerX: pos[0] + shapeSize[0] / 2,
      centerY: pos[1] + shapeSize[1] / 2,
    };
  };

  const bind = useDrag(
    ({ xy: [x, y], first, last }) => {
      if (first) {
        selectShape(id);
      }

      const vec = new THREE.Vector3();
      vec.set(
        (x / canvasSize.width) * 2 - 1,
        -(y / canvasSize.height) * 2 + 1,
        0
      );
      vec.unproject(camera);
      vec.z = 0;

      let snappedX = vec.x;
      let snappedY = vec.y;
      const newSnapLines: [number, number, number, number][] = [];

      const currentEdges = getEdges([vec.x, vec.y], size);
      const otherShapes = getShapes().filter((s) => s.id !== id);

      otherShapes.forEach((otherShape) => {
        const otherEdges = getEdges(otherShape.position, otherShape.size);

        // Horizontal alignment
        if (Math.abs(currentEdges.left - otherEdges.left) < SNAP_THRESHOLD) {
          snappedX = otherEdges.left;
          newSnapLines.push([otherEdges.left, -10, otherEdges.left, 10]);
        }

        // Vertical alignment
        if (
          Math.abs(currentEdges.bottom - otherEdges.bottom) < SNAP_THRESHOLD
        ) {
          snappedY = otherEdges.bottom;
          newSnapLines.push([-10, otherEdges.bottom, 10, otherEdges.bottom]);
        }
      });

      setSnapLines(newSnapLines);
      updateShapePosition(id, [snappedX, snappedY]);

      if (last) {
        selectShape(null);
        setSnapLines([]);
      }
    },
    { threshold: 10 }
  );

  const isSelected = selectedShape === id;

  return (
    <>
      {/* @ts-ignore */}
      <mesh {...bind()} ref={ref} position={[position[0], position[1], 0]}>
        {type === 'rectangle' ? (
          <planeGeometry args={size} />
        ) : (
          <circleGeometry args={[size[0] / 2, 32]} />
        )}
        <meshStandardMaterial color={color} />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(...size, 0.1)]} />
            <lineBasicMaterial color="white" />
          </lineSegments>
        )}
      </mesh>
      {snapLines.map((line, index) => (
        <line key={index}>
          <bufferGeometry attach="geometry" {...lineGeometry(line)} />
          <lineBasicMaterial attach="material" color={GRID_COLOR} />
        </line>
      ))}
    </>
  );
}

function lineGeometry([x1, y1, x2, y2]: [number, number, number, number]) {
  const points = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)];
  return new THREE.BufferGeometry().setFromPoints(points);
}
