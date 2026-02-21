import { useState } from 'react';

export function usePianoState() {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  return { activeKeys, setActiveKeys };
}
