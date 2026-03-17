export interface StreamConnection {
  reader: ReadableStreamDefaultReader<Uint8Array>;
  contentType: string;
  abort: () => void;
}

export interface SSEEvent {
  event: string;
  data: string;
}

export type StreamParser = (
  reader: ReadableStreamDefaultReader<Uint8Array>
) => AsyncGenerator<string, void, unknown>;
