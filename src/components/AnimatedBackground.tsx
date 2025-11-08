import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

function NetworkParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const initialPositions = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  const [currentPositions] = useState(() => new Float32Array(initialPositions));

  useFrame((state) => {
    if (!pointsRef.current || !lineRef.current) return;

    // Update mouse position in 3D space
    mouse.current.x = (state.pointer.x * viewport.width) / 2;
    mouse.current.y = (state.pointer.y * viewport.height) / 2;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const maxDistance = 3;
    const mouseInfluence = 2;
    const linePositions: number[] = [];

    // Update particle positions based on mouse
    for (let i = 0; i < positions.length; i += 3) {
      const dx = mouse.current.x - currentPositions[i];
      const dy = mouse.current.y - currentPositions[i + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseInfluence) {
        const force = (1 - distance / mouseInfluence) * 0.02;
        currentPositions[i] += dx * force;
        currentPositions[i + 1] += dy * force;
      }

      // Slowly return to initial position
      currentPositions[i] += (initialPositions[i] - currentPositions[i]) * 0.02;
      currentPositions[i + 1] += (initialPositions[i + 1] - currentPositions[i + 1]) * 0.02;
      currentPositions[i + 2] += (initialPositions[i + 2] - currentPositions[i + 2]) * 0.02;

      positions[i] = currentPositions[i];
      positions[i + 1] = currentPositions[i + 1];
      positions[i + 2] = currentPositions[i + 2];
    }

    // Rebuild lines based on new positions
    for (let i = 0; i < positions.length; i += 3) {
      for (let j = i + 3; j < positions.length; j += 3) {
        const dx = positions[i] - positions[j];
        const dy = positions[i + 1] - positions[j + 1];
        const dz = positions[i + 2] - positions[j + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < maxDistance) {
          linePositions.push(positions[i], positions[i + 1], positions[i + 2]);
          linePositions.push(positions[j], positions[j + 1], positions[j + 2]);
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Update line geometry
    lineRef.current.geometry.dispose();
    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    lineRef.current.geometry = newGeometry;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={initialPositions.length / 3}
            array={initialPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#8b5cf6"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={0}
            array={new Float32Array(0)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.3}
        />
      </lineSegments>
    </>
  );
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: '#000000' }}
      >
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <NetworkParticles />
      </Canvas>
    </div>
  );
}
