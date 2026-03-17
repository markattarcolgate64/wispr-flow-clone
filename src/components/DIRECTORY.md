# components/

React UI components. Each file exports a single named component with a co-located props interface.

## Files

| File | Description |
|------|-------------|
| `EndpointInput.tsx` | Text input for the API endpoint URL |
| `RecordButton.tsx` | Circular record/stop button with pulse animation during recording |
| `SendButton.tsx` | Sends the current audio blob to the endpoint via `postAudio()`, shows sending/status feedback |
| `TranscriptBox.tsx` | Displays live-streamed transcript text with a blinking cursor during streaming; shows placeholder text when idle |
| `ModeSwitcher.tsx` | Segmented control to switch between click-to-toggle and press-and-hold recording modes |
| `RecordingList.tsx` | Lists saved recordings with play/stop, send, and delete actions; exports the `Recording` interface |
