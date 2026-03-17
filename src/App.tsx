import { useState, useCallback, useRef } from "react";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useTranscriptStream } from "./hooks/useTranscriptStream";
import { EndpointInput } from "./components/EndpointInput";
import { RecordButton } from "./components/RecordButton";
import { SendButton } from "./components/SendButton";
import { RecordingList, type Recording } from "./components/RecordingList";
import { TranscriptBox } from "./components/TranscriptBox";
import strings from "./strings.json";

function App() {
  const [endpointUrl, setEndpointUrl] = useState(
    import.meta.env.VITE_API_ENDPOINT ?? ""
  );
  const { isRecording, audioBlob, startRecording, stopRecording, reset } =
    useAudioRecorder();
  const { text, isStreaming, error, startStream, clear } =
    useTranscriptStream();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const nextIdRef = useRef(1);

  const handleStop = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

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

  return (
    <div className="flex w-full max-w-[1200px] gap-10 px-6">
      <TranscriptBox
        text={text}
        isStreaming={isStreaming}
        error={error}
        onClear={clear}
      />
      <div className="w-[480px] shrink-0 pt-20 flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          {strings.appTitle}
        </h1>
        <EndpointInput value={endpointUrl} onChange={setEndpointUrl} />
        <RecordButton
          isRecording={isRecording}
          hasRecording={!!audioBlob}
          onStart={startRecording}
          onStop={handleStop}
        />
        {audioBlob && (
          <div className="flex gap-3">
            <button
              className="px-6 py-2.5 bg-transparent border-2 border-accent-green rounded-lg text-accent-green text-sm font-semibold cursor-pointer transition-[background,color] hover:bg-accent-green hover:text-bg"
              onClick={handleSave}
            >
              {strings.save}
            </button>
          </div>
        )}
        <SendButton
          disabled={!audioBlob || !endpointUrl.trim()}
          isSending={isStreaming}
          onSend={() => {
            if (audioBlob) {
              handleSend(audioBlob);
              reset();
            }
          }}
        />
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
