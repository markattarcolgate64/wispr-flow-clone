import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordingList, type Recording } from "../../components/RecordingList";

const mockPlay = jest.fn().mockResolvedValue(undefined);
const mockPause = jest.fn();
let lastAudioInstance: { play: jest.Mock; pause: jest.Mock; onended: (() => void) | null; src: string; currentTime: number };

beforeEach(() => {
  jest.clearAllMocks();
  (URL.createObjectURL as jest.Mock).mockReturnValue("blob:mock-url");

  lastAudioInstance = {
    play: mockPlay,
    pause: mockPause,
    onended: null,
    src: "",
    currentTime: 0,
  };

  jest.spyOn(globalThis, "Audio").mockImplementation(() => lastAudioInstance as unknown as HTMLAudioElement);
});

const makeRecording = (id: number): Recording => ({
  id,
  blob: new Blob(["audio"], { type: "audio/webm" }),
  label: `Recording ${id}`,
});

describe("RecordingList", () => {
  const defaults = {
    recordings: [] as Recording[],
    onDelete: jest.fn(),
    onSend: jest.fn(),
    sendingId: null,
  };

  it("shows 'No recordings yet' when recordings is empty", () => {
    render(<RecordingList {...defaults} />);
    expect(screen.getByText("No recordings yet")).toBeInTheDocument();
  });

  it("always shows 'Recordings' heading", () => {
    render(<RecordingList {...defaults} />);
    expect(screen.getByText("Recordings")).toBeInTheDocument();
  });

  it("shows 'Recordings' heading with items", () => {
    render(<RecordingList {...defaults} recordings={[makeRecording(1)]} />);
    expect(screen.getByText("Recordings")).toBeInTheDocument();
  });

  it("renders each recording with its label", () => {
    const recordings = [makeRecording(1), makeRecording(2)];
    render(<RecordingList {...defaults} recordings={recordings} />);

    expect(screen.getByText("Recording 1")).toBeInTheDocument();
    expect(screen.getByText("Recording 2")).toBeInTheDocument();
  });

  it("renders Play, Send, Delete buttons for each item", () => {
    render(<RecordingList {...defaults} recordings={[makeRecording(1)]} />);

    expect(screen.getByText("Play")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onDelete with correct id on Delete click", async () => {
    render(<RecordingList {...defaults} recordings={[makeRecording(42)]} />);

    await userEvent.click(screen.getByText("Delete"));
    expect(defaults.onDelete).toHaveBeenCalledWith(42);
  });

  it("calls onSend with correct recording on Send click", async () => {
    const rec = makeRecording(7);
    render(<RecordingList {...defaults} recordings={[rec]} />);

    await userEvent.click(screen.getByText("Send"));
    expect(defaults.onSend).toHaveBeenCalledWith(rec);
  });

  it("shows 'Sending...' and disables Send button when sendingId matches", () => {
    render(
      <RecordingList {...defaults} recordings={[makeRecording(3)]} sendingId={3} />
    );

    const sendBtn = screen.getByText("Sending...");
    expect(sendBtn).toBeDisabled();
  });

  it("Play click: creates object URL, calls audio.play, toggles to Stop", async () => {
    render(<RecordingList {...defaults} recordings={[makeRecording(1)]} />);

    await userEvent.click(screen.getByText("Play"));

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockPlay).toHaveBeenCalled();
    expect(screen.getByText("Stop")).toBeInTheDocument();
  });

  it("Stop click: pauses audio, revokes URL, reverts to Play", async () => {
    render(<RecordingList {...defaults} recordings={[makeRecording(1)]} />);

    await userEvent.click(screen.getByText("Play"));
    await userEvent.click(screen.getByText("Stop"));

    expect(mockPause).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
    expect(screen.getByText("Play")).toBeInTheDocument();
  });
});
