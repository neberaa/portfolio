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
  delayedFade,
  getPointCount,
  heroMotion,
  introFade,
  introScale,
  parallaxOffset,
  pointerNormal,
  scrollRatio,
  type HeroShape,
  type Point,
} from "@/helpers/webgl";
import { getScreenScenes, type ScreenScene } from "@/helpers/scenes";
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
  id: string;
  shape: HeroShape;
  line: THREE.LineLoop;
  points: THREE.Points;
};

type SceneView = {
  scene: ScreenScene;
  group: THREE.Group;
  shapes: ShapeView[];
};

type FieldProps = {
  count: number;
  compact: boolean;
};

const Field = ({ count, compact }: FieldProps): ReactElement => {
  const { activeId } = useSiteScroll();
  const activeRef = useRef(activeId);
  activeRef.current = activeId;
  const shownRef = useRef("");
  const arrivedRef = useRef(0);
  const travelRef = useRef(0);
  const fadeRef = useRef<number[]>([]);
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

  const buildScenes = (): SceneView[] => {
    const specs = getScreenScenes(compact);
    const views: SceneView[] = [];
    for (const scene of specs) {
      const group = new THREE.Group();
      const shapes: ShapeView[] = [];
      for (let index = 0; index < scene.shapes.length; index += 1) {
        const shape = scene.shapes[index];
        if (!shape) continue;
        const line = createLoop(shape.sides, shape.color);
        const points = createPoints(shape.sides * shape.pointsPerEdge, shape.size);
        group.add(line);
        group.add(points);
        shapes.push({ id: `${scene.id}-${index}`, shape, line, points });
      }
      views.push({ scene, group, shapes });
    }
    return views;
  };

  const points = useMemo(buildPoints, [count]);
  const grid = useMemo(buildGrid, []);
  const scenes = useMemo(buildScenes, [compact]);

  const release = (): (() => void) => {
    const dispose = (): void => {
      points.geometry.dispose();
      disposeMaterial(points.material);
      grid.geometry.dispose();
      disposeMaterial(grid.material);
      for (const view of scenes) {
        for (const shape of view.shapes) {
          shape.line.geometry.dispose();
          disposeMaterial(shape.line.material);
          shape.points.geometry.dispose();
          disposeMaterial(shape.points.material);
        }
        view.group.clear();
      }
    };
    return dispose;
  };

  useEffect(release, [grid, points, scenes]);

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

  const readPanelScroll = (screenId: string): number => {
    const panel = document.getElementById(`${screenId}-panel`);
    const scroller = panel?.querySelector(".section-scroll");
    if (!(scroller instanceof HTMLElement)) return 0;
    return scrollRatio(scroller.scrollTop, scroller.clientHeight, scroller.scrollHeight);
  };

  const animate = ({ clock }: RootState): void => {
    if (document.hidden) return;
    const time = clock.elapsedTime;
    const screenId = activeRef.current;
    if (screenId !== shownRef.current) {
      shownRef.current = screenId;
      arrivedRef.current = time;
    }
    let sceneIndex = 0;
    for (let index = 0; index < scenes.length; index += 1) {
      if (scenes[index]?.scene.id === screenId) sceneIndex = index;
    }
    travelRef.current = damp(travelRef.current, sceneIndex, heroMotion.travelStep);
    if (fineRef.current) {
      followRef.current.x = followAxis(followRef.current.x, aimRef.current.x, heroMotion.followX, heroMotion.followStep);
      followRef.current.y = followAxis(followRef.current.y, aimRef.current.y, heroMotion.followY, heroMotion.followStep);
    }
    const panelScroll = readPanelScroll(screenId);

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

    if (fadeRef.current.length !== scenes.length) {
      const next: number[] = [];
      for (let index = 0; index < scenes.length; index += 1) next.push(0);
      fadeRef.current = next;
    }

    const waited = time - arrivedRef.current;
    for (let index = 0; index < scenes.length; index += 1) {
      const view = scenes[index];
      if (!view) continue;
      const active = view.scene.id === screenId;
      const reveal = !active
        ? 0
        : view.scene.id === "home"
          ? introFade(time, heroMotion.introSeconds)
          : delayedFade(waited, view.scene.delay, view.scene.fade);
      const current = fadeRef.current[index] ?? 0;
      const shown = damp(current, reveal, active ? 1 : heroMotion.exitStep);
      fadeRef.current[index] = shown;
      const grow = view.scene.id === "home" ? introScale(time, heroMotion.introSeconds) : 0.84 + shown * 0.16;
      const follow = active ? view.scene.follow : 0;
      view.group.position.x =
        view.scene.x + parallaxOffset(travelRef.current, view.scene.index, view.scene.parallaxX) + followRef.current.x * follow;
      view.group.position.y =
        view.scene.y +
        parallaxOffset(travelRef.current, view.scene.index, view.scene.parallaxY) +
        (active ? panelScroll * view.scene.scrollLift : 0) +
        Math.sin(time * 0.35 + view.scene.index) * view.scene.bob +
        followRef.current.y * follow;
      view.group.scale.setScalar(view.scene.scale * grow);
      view.group.rotation.z = view.scene.roll + time * view.scene.spin;
      view.group.rotation.y = fineRef.current ? aimRef.current.x * 0.22 * follow : 0;
      view.group.rotation.x = fineRef.current ? -aimRef.current.y * 0.1 * follow : 0;
      for (const shape of view.shapes) {
        writeLoop(shape.line, shape.shape, 1, time);
        writeShapePoints(shape.points, shape.shape, 1, time);
        setOpacity(shape.line.material, shown * shape.shape.lineOpacity);
        setOpacity(shape.points.material, shown);
      }
    }
  };

  useFrame(animate);

  const renderScene = (view: SceneView): ReactElement => <primitive key={view.scene.id} object={view.group} />;

  return (
    <>
      <primitive object={grid} />
      <primitive object={points} />
      {scenes.map(renderScene)}
    </>
  );
};

export const SceneField = (): ReactElement | null => {
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
