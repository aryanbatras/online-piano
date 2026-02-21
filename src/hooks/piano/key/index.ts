/**
 * Piano Key Hook Hierarchy
 * 
 * Level 1 (Foundation):
 * - useKeyEvents (mouse/touch event handling)
 * - useKeyClasses (CSS class generation)
 * - useKeyboardMapping (keyboard mapping display)
 * 
 * Level 2 (System):
 * - usePianoKey (combines all key-level functionality)
 */

// Level 1 - Foundation hooks
export { useKeyEvents } from './useKeyEvents';
export { useKeyClasses } from './useKeyClasses';
export { useKeyDisplayText } from './useKeyDisplayText';
export { usePianoKey } from './usePianoKey';
