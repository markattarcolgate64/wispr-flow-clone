import { useState, useCallback } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTranscriptStream } from "../../hooks/useTranscriptStream";
import { TranscriptBox } from "../../components/TranscriptBox";

// Test harness that wires up the same hooks and components as App,
// bypassing import.meta.env which ts-jest can't handle.
const mockBlob = new Blob(["fake-audio"], { type: "audio/webm" });
const ENDPOINT = "http://localhost:8000/api/audio";

function TestHarness() {
  const { text, isStreaming, error, startStream, clear } =
    useTranscriptStream();

  return (
    <>
      <TranscriptBox
        text={text}
        isStreaming={isStreaming}
        error={error}
        onClear={clear}
      />
      <button onClick={() => startStream(ENDPOINT, mockBlob)}>Send</button>
    </>
  );
}

// Mimics App's main send flow: startStream + immediate reset
function TestHarnessWithReset() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(mockBlob);
  const { text, isStreaming, error, startStream, clear } =
    useTranscriptStream();

  const handleSend = useCallback(
    async (blob: Blob) => {
      await startStream(ENDPOINT, blob);
    },
    [startStream]
  );

  return (
    <>
      <TranscriptBox
        text={text}
        isStreaming={isStreaming}
        error={error}
        onClear={clear}
      />
      <button
        onClick={() => {
          if (audioBlob) {
            handleSend(audioBlob);
            setAudioBlob(null);
          }
        }}
      >
        Send
      </button>
    </>
  );
}

function createSSEResponse(chunks: string[]) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return {
    ok: true,
    status: 200,
    headers: new Headers({ "content-type": "text/event-stream" }),
    body: stream,
  };
}

describe("E2E: audio → SSE stream → transcript box", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("displays streamed words in the transcript box", async () => {
    const user = userEvent.setup();

    const ssePayload = [
      "event: start\ndata: \n\n",
      "event: word\ndata: Hello\n\n",
      "event: word\ndata:  beautiful\n\n",
      "event: word\ndata:  world\n\n",
      "event: done\ndata: \n\n",
    ];

    globalThis.fetch = jest.fn().mockResolvedValue(
      createSSEResponse(ssePayload)
    );

    render(<TestHarness />);

    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      const content = screen.getByTestId("transcript-content");
      expect(content).toHaveTextContent("Hello beautiful world");
    });

    // Verify fetch was called correctly
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (globalThis.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe("POST");
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.body as FormData).get("audio")).toBeInstanceOf(Blob);
  });

  it("shows error when server returns non-200", async () => {
    const user = userEvent.setup();

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    render(<TestHarness />);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByText(/Stream failed/)).toBeInTheDocument();
    });
  });

  it("handles all SSE events arriving in a single chunk", async () => {
    const user = userEvent.setup();

    const singleChunk = [
      "event: word\ndata: One\n\nevent: word\ndata:  big\n\nevent: word\ndata:  chunk\n\nevent: done\ndata: \n\n",
    ];

    globalThis.fetch = jest.fn().mockResolvedValue(
      createSSEResponse(singleChunk)
    );

    render(<TestHarness />);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      const content = screen.getByTestId("transcript-content");
      expect(content).toHaveTextContent("One big chunk");
    });
  });

  it("handles SSE events split across chunk boundaries", async () => {
    const user = userEvent.setup();

    // The word "Split" is cut between two network chunks
    const splitChunks = [
      "event: word\ndata: Spl",
      "it\n\nevent: word\ndata:  test\n\nevent: done\ndata: \n\n",
    ];

    globalThis.fetch = jest.fn().mockResolvedValue(
      createSSEResponse(splitChunks)
    );

    render(<TestHarness />);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      const content = screen.getByTestId("transcript-content");
      expect(content).toHaveTextContent("Split test");
    });
  });

  it("clears transcript when Clear is clicked", async () => {
    const user = userEvent.setup();

    globalThis.fetch = jest.fn().mockResolvedValue(
      createSSEResponse(["event: word\ndata: Hello\n\nevent: done\ndata: \n\n"])
    );

    render(<TestHarness />);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByTestId("transcript-content")).toHaveTextContent(
        "Hello"
      );
    });

    await user.click(screen.getByRole("button", { name: "Clear" }));

    // After clearing, transcript box is empty — no placeholder returns
    await waitFor(() => {
      const content = screen.getByTestId("transcript-content");
      expect(content).toHaveTextContent("");
      expect(content).not.toHaveClass("italic");
    });
  });

  it("streams text when reset is called immediately after send (App main send flow)", async () => {
    const user = userEvent.setup();

    const ssePayload = [
      "event: word\ndata: Hello\n\n",
      "event: word\ndata:  from\n\n",
      "event: word\ndata:  main\n\n",
      "event: done\ndata: \n\n",
    ];

    globalThis.fetch = jest.fn().mockResolvedValue(
      createSSEResponse(ssePayload)
    );

    render(<TestHarnessWithReset />);

    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      const content = screen.getByTestId("transcript-content");
      expect(content).toHaveTextContent("Hello from main");
    });
  });
});
