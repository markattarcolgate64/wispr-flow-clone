import type { StreamConnection } from "./types";

export function buildAudioFormData(blob: Blob): FormData {
  const fd = new FormData();
  fd.append("audio", blob, "recording.webm");
  return fd;
}

export async function fetchStream(
  url: string,
  body: FormData,
  signal: AbortSignal
): Promise<StreamConnection> {
  const res = await fetch(url, {
    method: "POST",
    body,
    signal,
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const contentType = res.headers.get("content-type") ?? "";

  return {
    reader,
    contentType,
    abort: () => signal.dispatchEvent(new Event("abort")),
  };
}