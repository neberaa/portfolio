"use client";

import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import type { SceneField } from "@/components/webgl/scene-field";

type FieldModule = typeof import("@/components/webgl/scene-field");

const pickField = (module: FieldModule): { default: typeof SceneField } => ({
  default: module.SceneField,
});

const loadField = (): Promise<{ default: typeof SceneField }> =>
  import("@/components/webgl/scene-field").then(pickField);

const Field = dynamic(loadField, { ssr: false });

export const SceneBackground = (): ReactElement => <Field />;
