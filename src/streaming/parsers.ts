import type { SSEEvent } from "./types";

/**
 * Decodes a byte stream into string chunks.
 */
async function* decodeChunks(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<string, void, unknown> {
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
  // Flush any remaining bytes
  const final = decoder.decode();
  if (final) yield final;
}

/**
 * Parses an SSE byte stream into typed events.
 * Handles chunk boundaries correctly by buffering partial lines.
 */
export async function* parseSSE(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<SSEEvent, void, unknown> {
  let buffer = "";

  for await (const chunk of decodeChunks(reader)) {
    buffer += chunk;

    // SSE events are separated by double newlines
    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      let event = "message";
      let data = "";

      for (const line of block.split("\n")) {
        if (line.startsWith("event: ")) {
          event = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          data += (data ? "\n" : "") + line.slice(6);
        } else if (line.startsWith(":")) {
          // SSE comment, ignore
        }
      }

      if (data === "[DONE]") return;
      if (data) yield { event, data };
    }
  }
}

/**
 * Parses a raw text byte stream, yielding string chunks as-is.
 * Wraps each chunk as an SSEEvent with event="text" for uniform handling.
 */
export async function* parseRawText(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<SSEEvent, void, unknown> {
  for await (const chunk of decodeChunks(reader)) {
    if (chunk) yield { event: "text", data: chunk };
  }
}
