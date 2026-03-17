import { useState, useCallback, useRef, useEffect } from "react";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useTranscriptStream } from "./hooks/useTranscriptStream";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { RecordButton } from "./components/RecordButton";
import { SendButton } from "./components/SendButton";
import { RecordingList, type Recording } from "./components/RecordingList";
import { TranscriptBox } from "./components/TranscriptBox";
import strings from "./strings.json";

type RecordingMode = "toggle" | "hold";

function App() {
  const endpointUrl = import.meta.env.VITE_API_ENDPOINT ?? "";
  const { isRecording, audioBlob, startRecording, stopRecording, reset } =
    useAudioRecorder();
  const { text, isStreaming, error, startStream, clear } =
    useTranscriptStream();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const nextIdRef = useRef(1);
  const [recordingMode, setRecordingMode] = useState<RecordingMode>("toggle");
  const pendingSendRef = useRef(false);

  // Auto-send when blob arrives after hold-mode release
  useEffect(() => {
    if (audioBlob && pendingSendRef.current) {
      pendingSendRef.current = false;
      if (audioBlob.size > 0 && endpointUrl.trim()) {
        handleSend(audioBlob);
      }
      reset();
    }
  }, [audioBlob]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStop = useCallback(() => {
    stopRecording();
    if (recordingMode === "hold") {
      pendingSendRef.current = true;
    }
  }, [stopRecording, recordingMode]);

  const handleSave = useCallback(() => {
    if (!audioBlob) return;
    setRecordings((prev) => [
      ...prev,
      {
        id: nextIdRef.current,
        blob: audioBlob,
        label: `${strings.recordingLabel} ${nextIdRef.current}`,
      },
    ]);
    nextIdRef.current++;
    reset();
  }, [audioBlob, reset]);

  const handleDelete = useCallback((id: number) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleSend = useCallback(
    async (blob: Blob) => {
      if (!endpointUrl.trim()) return;
      await startStream(endpointUrl, blob);
    },
    [endpointUrl, startStream]
  );

  const handleSendRecording = useCallback(
    async (recording: Recording) => {
      setSendingId(recording.id);
      await handleSend(recording.blob);
      setSendingId(null);
    },
    [handleSend]
  );

  const handleModeChange = useCallback(
    (newMode: RecordingMode) => {
      if (audioBlob) reset();
      clear();
      setRecordingMode(newMode);
    },
    [audioBlob, reset, clear]
  );

  return (
    <div className="flex w-full max-w-[1200px] gap-10 px-6">
      <TranscriptBox
        text={text}
        isStreaming={isStreaming}
        error={error}
        onClear={clear}
      />
      <div className="w-[320px] shrink-0 pt-20 flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          {strings.appTitle}
        </h1>
        <ModeSwitcher
          mode={recordingMode}
          onChange={handleModeChange}
          disabled={isRecording || isStreaming}
        />
        <RecordButton
          isRecording={isRecording}
          hasRecording={!!audioBlob}
          onStart={startRecording}
          onStop={handleStop}
          mode={recordingMode}
        />
        {recordingMode === "toggle" && audioBlob && (
          <div className="flex gap-3">
            <button
              className="px-6 py-2.5 bg-transparent border-2 border-accent-green rounded-lg text-accent-green text-sm font-semibold cursor-pointer transition-[background,color] hover:bg-accent-green hover:text-bg"
              onClick={handleSave}
            >
              {strings.save}
            </button>
          </div>
        )}
        {recordingMode === "toggle" && (
          <SendButton
            disabled={!audioBlob || !endpointUrl}
            isSending={isStreaming}
            onSend={() => {
              if (audioBlob) {
                handleSend(audioBlob);
                reset();
              }
            }}
          />
        )}
      </div>
      <RecordingList
        recordings={recordings}
        onDelete={handleDelete}
        onSend={handleSendRecording}
        sendingId={sendingId}
      />
    </div>
  );
}

export default App;
