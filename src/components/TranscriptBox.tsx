import { useState, useEffect } from "react";
import strings from "../strings.json";

interface TranscriptBoxProps {
  text: string;
  isStreaming: boolean;
  error: string | null;
  onClear: () => void;
}

const PLACEHOLDER_TEXT = strings.transcriptPlaceholder;

export function TranscriptBox({
  text,
  isStreaming,
  error,
  onClear,
}: TranscriptBoxProps) {
  const [hasBeenUsed, setHasBeenUsed] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      setHasBeenUsed(true);
    }
  }, [isStreaming]);

  const showPlaceholder = !hasBeenUsed && !text && !isStreaming && !error;

  return (
    <div className="flex-1 min-w-[300px] pt-20">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          {strings.transcriptHeading}
        </h2>
        {text && (
          <button
            className="px-2.5 py-0.5 text-[0.7rem] font-semibold rounded border border-text-dim bg-transparent text-text-dim transition-[background,color] hover:bg-text-dim hover:text-white cursor-pointer"
            onClick={onClear}
          >
            {strings.clear}
          </button>
        )}
      </div>
      <div
        data-testid="transcript-content"
        className={`w-full min-h-[400px] max-h-[600px] overflow-y-auto p-5 bg-bg-input border border-border-light rounded-lg text-[0.95rem] leading-[1.7] text-white whitespace-pre-wrap break-words ${showPlaceholder ? "text-text-dim italic" : ""}`}
      >
        {showPlaceholder ? PLACEHOLDER_TEXT : text}
        {isStreaming && <span data-testid="cursor" className="inline-block w-0.5 h-[1em] bg-white ml-0.5 align-text-bottom animate-blink" />}
      </div>
      {error && (
        <p data-testid="transcript-error" className="mt-2 text-sm text-accent-red">
          {error}
        </p>
      )}
    </div>
  );
}
