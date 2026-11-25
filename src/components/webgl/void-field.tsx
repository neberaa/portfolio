"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import * as THREE from "three";
import {
  buildPointColors,
  canUseWebgl,
  createPointField,
  driftPoint,
  getPointCount,
} from "@/helpers/webgl";
import { measure } from "@/data/design";
import { readReducedMotion } from "@/helpers/motion";

type FieldProps = {
  count: number;
};

const Field = ({ count }: FieldProps): ReactElement => {
  const points = useMemo(() => {
    const origins = createPointField(count);
    const positions = new Float32Array(count * 3);
    origins.forEach((origin, index) => {
      positions.set(origin, index * 3);
    });
    const colors = new Float32Array(buildPointColors(origins));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const mesh = new THREE.Points(geometry, material);
    mesh.userData.origins = origins;
    return mesh;
  }, [count]);

  const grid = useMemo(() => {
    const helper = new THREE.GridHelper(52, 26, 0x123044, 0x0c1824);
    helper.position.set(0, -6, -8);
    const materials = Array.isArray(helper.material) ? helper.material : [helper.material];
    materials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.28;
    });
    return helper;
  }, []);

  useEffect(
    () => () => {
      points.geometry.dispose();
      const material = points.material;
      if (!Array.isArray(material)) material.dispose();
      grid.geometry.dispose();
      const gridMaterial = grid.material;
      const materials = Array.isArray(gridMaterial) ? gridMaterial : [gridMaterial];
      materials.forEach((material) => material.dispose());
    },
    [grid, points],
  );

  useFrame(({ clock, pointer }) => {
    if (document.hidden) return;
    const origins = points.userData.origins as ReturnType<typeof createPointField>;
    const attribute = points.geometry.getAttribute("position");
    origins.forEach((origin, index) => {
      const [x, y, z] = driftPoint(origin, clock.elapsedTime, index);
      attribute.setXYZ(index, x, y, z);
    });
    attribute.needsUpdate = true;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) {
      points.rotation.y = pointer.x * 0.12;
      points.rotation.x = pointer.y * 0.05;
    }
  });

  return (
    <>
      <primitive object={grid} />
      <primitive object={points} />
    </>
  );
};

export const VoidField = (): ReactElement | null => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const reduced = readReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const canvas = document.createElement("canvas");
    const readContext = (type: string): RenderingContext | null => canvas.getContext(type);
    const supported = canUseWebgl(readContext);
    if (reduced || !supported) return;
    const small = window.matchMedia(`(max-width: ${measure.breakpoint})`).matches;
    setCount(getPointCount(small));
  }, []);

  if (count === null) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <Field count={count} />
      </Canvas>
    </div>
  );
};
