export const nextAccordionId = (currentId: string, selectedId: string): string =>
  currentId === selectedId ? "" : selectedId;
