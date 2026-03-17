import strings from "../strings.json";

interface EndpointInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EndpointInput({ value, onChange }: EndpointInputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="endpoint-url"
        className="block text-xs uppercase tracking-widest text-text-muted mb-2"
      >
        {strings.endpointLabel}
      </label>
      <input
        id="endpoint-url"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={strings.endpointPlaceholder}
        className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg text-white font-mono text-sm outline-none transition-colors focus:border-text-dim"
      />
    </div>
  );
}
