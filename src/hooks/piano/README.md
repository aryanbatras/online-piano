# Piano Hook Hierarchy

This directory contains a hierarchical structure of piano-related hooks that clearly shows dependencies and separation of concerns.

## Folder Structure

```
piano/
├── state/
│   └── usePianoState.ts          # Level 1: Pure state management
├── actions/
│   └── usePianoActions.ts        # Level 1: Audio actions
├── interaction/
│   ├── usePianoInteraction.ts    # Level 2: Combines state + actions
│   └── usePianoKeyboard.ts       # Level 2: Keyboard event handling
├── system/
│   ├── usePianoSystem.ts         # Level 3: Complete piano system
│   └── usePianoUI.ts             # Level 3: UI state management
├── index.ts                      # Central exports with hierarchy docs
└── README.md                     # This file
```

## Dependency Hierarchy

### Level 1 (Foundation)
- **`usePianoState`** - Manages active keys state
  - No dependencies
  - Exports: `{ activeKeys, setActiveKeys }`

- **`usePianoActions`** - Handles audio playback
  - Depends on: `useAudioPlayer`
  - Exports: `{ keyPressed, keyReleased }`

### Level 2 (Interaction)
- **`usePianoInteraction`** - Combines state and audio logic
  - Depends on: `usePianoState`, `usePianoActions`
  - Exports: `{ activeKeys, handleKeyPressed, handleKeyReleased }`

- **`usePianoKeyboard`** - Manages keyboard events
  - Depends on: `useKeyboardMappings`
  - Exports: Side effects only

### Level 3 (System)
- **`usePianoSystem`** - Complete piano functionality
  - Depends on: `usePianoInteraction`, `usePianoKeyboard`
  - Exports: `{ activeKeys, handleKeyPressed, handleKeyReleased }`

- **`usePianoUI`** - UI state management
  - No dependencies
  - Exports: `{ toggleKeyMap, showKeyMap }`

## Usage

```typescript
// Import from the central index
import { usePianoSystem, usePianoUI } from '@/hooks/piano';

// Or import specific hooks
import { usePianoState } from '@/hooks/piano/state';
import { usePianoActions } from '@/hooks/piano/actions';
```

## Benefits

1. **Clear Dependencies**: Folder structure shows hook relationships
2. **Separation of Concerns**: Each hook has a single responsibility
3. **Reusability**: Hooks can be used independently or combined
4. **Testability**: Each level can be tested in isolation
5. **Maintainability**: Changes are localized to specific concerns
