/**
 * Piano Row Hook Hierarchy
 * 
 * Level 1 (Foundation):
 * - useWindowResize (window size tracking)
 * - useKeyLayout (key positioning and layout calculations)
 * 
 * Level 2 (System):
 * - usePianoRow (combines window resize + key layout)
 */

// Level 1 - Foundation hooks
export { useWindowResize } from './useWindowResize';
export { useKeyLayout } from './useKeyLayout';

// Level 2 - System hook
export { usePianoRow } from './usePianoRow';
