# src/

React 19 + TypeScript frontend source. Uses Vite for bundling and HMR.

## Files

| File | Description |
|------|-------------|
| `main.tsx` | Entry point: renders `<App />` inside `<StrictMode>` into `#root` |
| `App.tsx` | Root component: 3-column layout (TranscriptBox, main controls, RecordingList), manages recording state, endpoint URL, and saved recordings |
| `App.css` | Tailwind CSS entry point: imports Tailwind, defines custom theme colors/animations, and base body styles |
| `strings.json` | Centralized flat key-value map of all user-facing UI strings |

## Subdirectories

| Directory | Description |
|-----------|-------------|
| `components/` | React UI components |
| `hooks/` | Custom React hooks for audio recording and transcript streaming |
| `streaming/` | HTTP streaming transport, SSE parsing, and type definitions |
| `__tests__/` | Jest test files mirroring the source directory structure |
