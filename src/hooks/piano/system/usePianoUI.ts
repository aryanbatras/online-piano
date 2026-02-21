import { useState } from 'react';

export function usePianoUI() {
  const [showKeyMap, setShowKeyMap] = useState(true);
  const toggleKeyMap = () => setShowKeyMap(prev => !prev);
  return { toggleKeyMap, showKeyMap };
}
