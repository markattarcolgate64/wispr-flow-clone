import { useRef, useState } from "react";
import strings from "../strings.json";

export interface Recording {
  id: number;
  blob: Blob;
  label: string;
}

interface RecordingListProps {
  recordings: Recording[];
  onDelete: (id: number) => void;
  onSend: (recording: Recording) => void;
  sendingId: number | null;
}

const btnBase = "px-2.5 py-1 text-xs font-semibold rounded cursor-pointer border transition-[background,color]";

export function RecordingList({ recordings, onDelete, onSend, sendingId }: RecordingListProps) {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (recording: Recording) => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
    }

    const url = URL.createObjectURL(recording.blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(recording.id);

    audio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(url);
    };

    audio.play();
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  if (recordings.length === 0) {
    return (
      <div className="w-70 shrink-0 pt-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
          {strings.recordingsHeading}
        </h2>
        <p className="text-sm text-text-dim">{strings.noRecordings}</p>
      </div>
    );
  }

  return (
    <div className="w-70 shrink-0 pt-20">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
        {strings.recordingsHeading}
      </h2>
      <ul className="list-none flex flex-col gap-2">
        {recordings.map((rec) => (
          <li key={rec.id} className="flex items-center justify-between px-3.5 py-2.5 bg-bg-card border border-border-light rounded-lg">
            <span className="text-sm font-medium text-text-label">{rec.label}</span>
            <div className="flex gap-1.5">
              {playingId === rec.id ? (
                <button className={`${btnBase} border-accent-orange text-accent-orange hover:bg-accent-orange hover:text-bg`} onClick={handleStop}>
                  {strings.stop}
                </button>
              ) : (
                <button className={`${btnBase} border-white text-white hover:bg-white hover:text-bg`} onClick={() => handlePlay(rec)}>
                  {strings.play}
                </button>
              )}
              <button
                className={`${btnBase} border-accent-green text-accent-green hover:enabled:bg-accent-green hover:enabled:text-bg disabled:opacity-40 disabled:cursor-not-allowed`}
                onClick={() => onSend(rec)}
                disabled={sendingId === rec.id}
              >
                {sendingId === rec.id ? strings.sending : strings.send}
              </button>
              <button className={`${btnBase} border-text-dim text-text-dim hover:bg-accent-red hover:border-accent-red hover:text-white`} onClick={() => onDelete(rec.id)}>
                {strings.delete}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
