# streaming/

HTTP streaming infrastructure for sending audio and consuming server responses. Supports both SSE (`text/event-stream`) and raw text streams.

## Files

| File | Description |
|------|-------------|
| `types.ts` | TypeScript interfaces: `StreamConnection` (reader + contentType + abort), `SSEEvent` (event + data), `StreamParser` type |
| `parsers.ts` | `parseSSE()` — async generator that decodes a byte stream into `SSEEvent` objects with buffered line handling; `parseRawText()` — fallback that yields raw chunks as events |
| `transport.ts` | `buildAudioFormData()` — wraps a Blob in FormData; `fetchStream()` — POSTs FormData and returns a `StreamConnection`; `postAudio()` — fire-and-forget POST for send-only use |
