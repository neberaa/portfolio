"use client";

import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import * as THREE from "three";
import { measure } from "@/data/design";
import { readReducedMotion } from "@/helpers/motion";
import {
  buildPointColors,
  canUseWebgl,
  createPointField,
  damp,
  driftPoint,
  fillPolygonPositions,
  fillShapeColors,
  followAxis,
  getHeroShapes,
  getPointCount,
  heroMotion,
  introFade,
  introScale,
  pointerNormal,
  type HeroShape,
  type Point,
} from "@/helpers/webgl";
import { useSiteScroll } from "@/hooks/use-site-scroll";

const readAttribute = (geometry: THREE.BufferGeometry, name: string): THREE.BufferAttribute | null => {
  const attribute = geometry.getAttribute(name);
  if (!(attribute instanceof THREE.BufferAttribute)) return null;
  return attribute;
};

const asFloats = (attribute: THREE.BufferAttribute): Float32Array | null =>
  attribute.array instanceof Float32Array ? attribute.array : null;

const disposeMaterial = (material: THREE.Material | THREE.Material[]): void => {
  if (Array.isArray(material)) {
    for (const item of material) item.dispose();
    return;
  }
  material.dispose();
};

const createLoop = (segments: number, color: number): THREE.LineLoop => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segments * 3), 3));
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.LineLoop(geometry, material);
};

const createPoints = (pointCount: number, size: number): THREE.Points => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3));
  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
};

const setOpacity = (material: THREE.Material | THREE.Material[], opacity: number): void => {
  if (Array.isArray(material)) return;
  material.opacity = opacity;
};

type ShapeView = {
  id: number;
  shape: HeroShape;
  line: THREE.LineLoop;
  points: THREE.Points;
};

type FieldProps = {
  count: number;
  compact: boolean;
};

const Field = ({ count, compact }: FieldProps): ReactElement => {
  const { activeId } = useSiteScroll();
  const homeRef = useRef(activeId === "home");
  homeRef.current = activeId === "home";
  const presenceRef = useRef(homeRef.current ? 1 : 0);
  const groupRef = useRef<THREE.Group>(null);
  const aimRef = useRef({ x: 0, y: 0 });
  const followRef = useRef({ x: 0, y: 0 });
  const fineRef = useRef(false);

  const buildPoints = (): THREE.Points => {
    const origins = createPointField(count);
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < origins.length; index += 1) {
      const origin = origins[index];
      if (!origin) continue;
      positions.set(origin, index * 3);
    }
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
  };

  const buildGrid = (): THREE.GridHelper => {
    const helper = new THREE.GridHelper(52, 26, 0x123044, 0x0c1824);
    helper.position.set(0, -6, -8);
    const materials = Array.isArray(helper.material) ? helper.material : [helper.material];
    for (const material of materials) {
      material.transparent = true;
      material.opacity = 0.28;
    }
    return helper;
  };

  const buildShapes = (): ShapeView[] => {
    const specs = getHeroShapes(compact);
    const views: ShapeView[] = [];
    for (let index = 0; index < specs.length; index += 1) {
      const shape = specs[index];
      if (!shape) continue;
      views.push({
        id: index,
        shape,
        line: createLoop(shape.sides, shape.color),
        points: createPoints(shape.sides * shape.pointsPerEdge, shape.size),
      });
    }
    return views;
  };

  const points = useMemo(buildPoints, [count]);
  const grid = useMemo(buildGrid, []);
  const shapes = useMemo(buildShapes, [compact]);

  const release = (): (() => void) => {
    const dispose = (): void => {
      points.geometry.dispose();
      disposeMaterial(points.material);
      grid.geometry.dispose();
      disposeMaterial(grid.material);
      for (const view of shapes) {
        view.line.geometry.dispose();
        disposeMaterial(view.line.material);
        view.points.geometry.dispose();
        disposeMaterial(view.points.material);
      }
    };
    return dispose;
  };

  useEffect(release, [grid, points, shapes]);

  const watchPointer = (): (() => void) => {
    const onPointerMove = (event: PointerEvent): void => {
      aimRef.current.x = pointerNormal(event.clientX, window.innerWidth);
      aimRef.current.y = -pointerNormal(event.clientY, window.innerHeight);
    };
    const stop = (): void => {
      window.removeEventListener("pointermove", onPointerMove);
    };
    fineRef.current = window.matchMedia("(pointer: fine)").matches;
    if (!fineRef.current) return stop;
    window.addEventListener("pointermove", onPointerMove);
    return stop;
  };

  useEffect(watchPointer, []);

  const writeLoop = (loop: THREE.LineLoop, shape: HeroShape, scale: number, time: number): void => {
    const attribute = readAttribute(loop.geometry, "position");
    const values = attribute ? asFloats(attribute) : null;
    if (!attribute || !values) return;
    fillPolygonPositions(values, shape.sides, shape.sides, shape.radius, shape.tilt, shape.depth, time, shape.speed, scale);
    attribute.needsUpdate = true;
  };

  const writeShapePoints = (mesh: THREE.Points, shape: HeroShape, scale: number, time: number): void => {
    const position = readAttribute(mesh.geometry, "position");
    const color = readAttribute(mesh.geometry, "color");
    const positions = position ? asFloats(position) : null;
    const colors = color ? asFloats(color) : null;
    if (!position || !positions || !color || !colors) return;
    const pointCount = shape.sides * shape.pointsPerEdge;
    fillPolygonPositions(positions, pointCount, shape.sides, shape.radius, shape.tilt, shape.depth, time, shape.speed, scale);
    fillShapeColors(colors, pointCount, time, shape.speed * 2.4);
    position.needsUpdate = true;
    color.needsUpdate = true;
  };

  const animate = ({ clock }: RootState): void => {
    if (document.hidden) return;
    const time = clock.elapsedTime;
    const target = homeRef.current ? 1 : 0;
    presenceRef.current = damp(presenceRef.current, target, heroMotion.presenceStep);
    const scale = introScale(time, heroMotion.introSeconds);
    const fade = introFade(time, heroMotion.introSeconds) * presenceRef.current;
    if (fineRef.current) {
      followRef.current.x = followAxis(followRef.current.x, aimRef.current.x, heroMotion.followX, heroMotion.followStep);
      followRef.current.y = followAxis(followRef.current.y, aimRef.current.y, heroMotion.followY, heroMotion.followStep);
    }

    const origins = points.userData.origins as Point[];
    const attribute = readAttribute(points.geometry, "position");
    if (attribute) {
      for (let index = 0; index < origins.length; index += 1) {
        const origin = origins[index];
        if (!origin) continue;
        const [x, y, z] = driftPoint(origin, time, index);
        attribute.setXYZ(index, x, y, z);
      }
      attribute.needsUpdate = true;
    }

    if (fineRef.current) {
      points.rotation.y = aimRef.current.x * 0.12;
      points.rotation.x = -aimRef.current.y * 0.05;
    }

    const group = groupRef.current;
    if (group) {
      group.position.x = followRef.current.x;
      group.position.y = Math.sin(time * 0.35) * 0.18 + followRef.current.y;
      if (fineRef.current) {
        group.rotation.y = aimRef.current.x * 0.22;
        group.rotation.x = -aimRef.current.y * 0.1;
      }
    }

    for (const view of shapes) {
      writeLoop(view.line, view.shape, scale, time);
      writeShapePoints(view.points, view.shape, scale, time);
      setOpacity(view.line.material, fade * view.shape.lineOpacity);
      setOpacity(view.points.material, fade);
    }
  };

  useFrame(animate);

  const renderShape = (view: ShapeView): ReactElement => (
    <group key={view.id}>
      <primitive object={view.line} />
      <primitive object={view.points} />
    </group>
  );

  return (
    <>
      <primitive object={grid} />
      <primitive object={points} />
      <group ref={groupRef}>{shapes.map(renderShape)}</group>
    </>
  );
};

export const VoidField = (): ReactElement | null => {
  const [count, setCount] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);

  const measureField = (): void => {
    const reduced = readReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const canvas = document.createElement("canvas");
    const readContext = (type: string): RenderingContext | null => canvas.getContext(type);
    const supported = canUseWebgl(readContext);
    if (reduced || !supported) return;
    const small = window.matchMedia(`(max-width: ${measure.breakpoint})`).matches;
    setCompact(small);
    setCount(getPointCount(small));
  };

  useEffect(measureField, []);

  if (count === null) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 52 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <Field count={count} compact={compact} />
      </Canvas>
    </div>
  );
};
