"use client";

import dynamic from "next/dynamic";
import type { ReactElement } from "react";

const Field = dynamic(
  () => import("@/components/webgl/void-field").then((module) => module.VoidField),
  { ssr: false },
);

export const VoidBackground = (): ReactElement => <Field />;
