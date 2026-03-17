import strings from "../strings.json";

type RecordingMode = "toggle" | "hold";

interface RecordButtonProps {
  isRecording: boolean;
  hasRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  mode?: RecordingMode;
}

export function RecordButton({
  isRecording,
  hasRecording,
  onStart,
  onStop,
  mode = "toggle",
}: RecordButtonProps) {
  const label =
    mode === "hold"
      ? isRecording
        ? strings.recording
        : strings.holdToRecord
      : isRecording
        ? strings.stop
        : hasRecording
          ? strings.recordAgain
          : strings.record;

  const handleClick = mode === "toggle" ? (isRecording ? onStop : onStart) : undefined;

  const holdHandlers =
    mode === "hold"
      ? {
          onMouseDown: () => onStart(),
          onMouseUp: () => { if (isRecording) onStop(); },
          onMouseLeave: () => { if (isRecording) onStop(); },
          onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); onStart(); },
          onTouchEnd: (e: React.TouchEvent) => { e.preventDefault(); if (isRecording) onStop(); },
          onTouchCancel: () => { if (isRecording) onStop(); },
        }
      : {};

  return (
    <button
      className={`w-30 h-30 rounded-full border-3 border-border bg-bg-button text-white text-sm font-semibold cursor-pointer flex flex-col items-center justify-center gap-2 transition-[border-color,background] hover:border-text-dim ${isRecording ? "border-accent-red bg-accent-red/10 animate-pulse-record" : ""} ${mode === "hold" ? "touch-action-none select-none [-webkit-touch-callout:none]" : ""}`}
      onClick={handleClick}
      {...holdHandlers}
    >
      <span
        data-testid="record-dot"
        className={`w-3 h-3 rounded-full transition-colors ${isRecording ? "bg-accent-red" : "bg-text-dim"}`}
      />
      {label}
    </button>
  );
}
