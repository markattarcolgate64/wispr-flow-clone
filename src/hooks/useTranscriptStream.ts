import { useState, useRef, useCallback } from "react";
import { fetchStream, buildAudioFormData } from "../streaming/transport";
import { parseSSE, parseRawText } from "../streaming/parsers";

export function useTranscriptStream() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (url: string, audioBlob: Blob) => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setText("");
    setError(null);
    setIsStreaming(true);

    try {
      const conn = await fetchStream(
        url,
        buildAudioFormData(audioBlob),
        controller.signal
      );

      // Pick parser based on content type
      const parser = conn.contentType.includes("text/event-stream")
        ? parseSSE(conn.reader)
        : parseRawText(conn.reader);

      for await (const event of parser) {
        setText((prev) => prev + event.data);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(
          `Stream failed: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const clear = useCallback(() => {
    setText("");
    setError(null);
  }, []);

  return { text, isStreaming, error, startStream, stopStream, clear };
}
