# hooks/

Custom React hooks that encapsulate browser API interactions.

## Files

| File | Description |
|------|-------------|
| `useAudioRecorder.ts` | Wraps MediaRecorder API: requests mic access, captures audio chunks, produces a `Blob` on stop. Returns `{ isRecording, audioBlob, startRecording, stopRecording, reset }` |
| `useTranscriptStream.ts` | Sends audio to an endpoint via `fetchStream()`, auto-selects SSE or raw-text parser based on content-type, accumulates transcript text. Returns `{ text, isStreaming, error, startStream, stopStream, clear }` |
