# Virtual Piano

A modern, responsive virtual piano application built with Next.js and React. Features 88 keys across 4 rows with keyboard mappings and Web Audio API support.

## Features

- **88 Piano Keys**: Full piano keyboard with white and black keys
- **4 Row Layout**: Optimized layout for different screen sizes
- **Keyboard Mappings**: Play using your computer keyboard
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Touch Support**: Full touch event support for mobile devices
- **Web Audio API**: High-quality audio playback with proper gain control

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Keyboard Mappings

The piano supports keyboard mappings across 4 rows:

- **Row 1**: Number keys (1-0, -, =)
- **Row 2**: Q-P keys (use Shift for black keys)
- **Row 3**: A-L keys (use Shift for black keys)
- **Row 4**: Z-/ keys (use Shift for black keys)

## Project Structure

```
src/
├── components/
│   ├── Piano.tsx          # Main piano component
│   ├── PianoRow.tsx       # Individual piano row
│   └── PianoKey.tsx       # Individual piano key
├── hooks/
│   ├── useAudioPlayer.ts  # Audio playback logic
│   └── useKeyboardMappings.ts # Keyboard event handling
├── data/
│   └── pianoData.ts       # Piano data and mappings
├── types/
│   └── piano.ts           # TypeScript type definitions
└── styles/
    └── Piano.module.css   # Piano styling
```

## Technologies Used

- **Next.js 16.1.6**: React framework
- **React 19.2.3**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Web Audio API**: Audio playback

## Performance Optimizations

- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for event handlers
- Audio preloading and caching
- Optimized re-rendering patterns

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
