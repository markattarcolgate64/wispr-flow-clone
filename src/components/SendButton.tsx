import strings from "../strings.json";

interface SendButtonProps {
  disabled: boolean;
  isSending: boolean;
  onSend: () => void;
}

export function SendButton({ disabled, isSending, onSend }: SendButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        className="px-8 py-3 bg-transparent border-2 border-white rounded-lg text-white text-sm font-semibold cursor-pointer transition-[background,color] hover:enabled:bg-white hover:enabled:text-bg disabled:border-border disabled:text-border disabled:cursor-not-allowed"
        disabled={disabled || isSending}
        onClick={onSend}
      >
        {isSending ? strings.sending : strings.send}
      </button>
    </div>
  );
}
