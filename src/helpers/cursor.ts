export const showsCursorRing = (pointerType: string): boolean => pointerType === "mouse" || pointerType === "pen";

export const cursorRingTransform = (x: number, y: number): string =>
  `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
