import strings from "../strings.json";

type RecordingMode = "toggle" | "hold";

interface ModeSwitcherProps {
  mode: RecordingMode;
  onChange: (mode: RecordingMode) => void;
  disabled?: boolean;
}

const optionBase =
  "px-5 py-2 bg-transparent border-none text-text-muted text-xs font-semibold cursor-pointer transition-[background,color] disabled:cursor-not-allowed disabled:opacity-50";

export function ModeSwitcher({ mode, onChange, disabled }: ModeSwitcherProps) {
  return (
    <div className="flex bg-bg-card border border-border rounded-lg overflow-hidden">
      <button
        className={`${optionBase} ${mode === "toggle" ? "bg-border text-white" : ""}`}
        onClick={() => onChange("toggle")}
        disabled={disabled}
      >
        {strings.modeClick}
      </button>
      <button
        className={`${optionBase} ${mode === "hold" ? "bg-border text-white" : ""}`}
        onClick={() => onChange("hold")}
        disabled={disabled}
      >
        {strings.modeHold}
      </button>
    </div>
  );
}
