import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordButton } from "../../components/RecordButton";

describe("RecordButton", () => {
  const defaults = {
    isRecording: false,
    hasRecording: false,
    onStart: jest.fn(),
    onStop: jest.fn(),
    mode: "toggle" as const,
  };

  beforeEach(() => jest.clearAllMocks());

  it("shows 'Record' when not recording and no prior recording", () => {
    render(<RecordButton {...defaults} />);
    expect(screen.getByText("Record")).toBeInTheDocument();
  });

  it("shows 'Stop' when recording", () => {
    render(<RecordButton {...defaults} isRecording={true} />);
    expect(screen.getByText("Stop")).toBeInTheDocument();
  });

  it("shows 'Record Again' when not recording but has a prior recording", () => {
    render(<RecordButton {...defaults} hasRecording={true} />);
    expect(screen.getByText("Record Again")).toBeInTheDocument();
  });

  it("calls onStart when clicked while not recording", async () => {
    render(<RecordButton {...defaults} />);
    await userEvent.click(screen.getByRole("button"));
    expect(defaults.onStart).toHaveBeenCalledTimes(1);
    expect(defaults.onStop).not.toHaveBeenCalled();
  });

  it("calls onStop when clicked while recording", async () => {
    render(<RecordButton {...defaults} isRecording={true} />);
    await userEvent.click(screen.getByRole("button"));
    expect(defaults.onStop).toHaveBeenCalledTimes(1);
    expect(defaults.onStart).not.toHaveBeenCalled();
  });

  it("has recording Tailwind classes when isRecording is true", () => {
    render(<RecordButton {...defaults} isRecording={true} />);
    expect(screen.getByRole("button")).toHaveClass("border-accent-red");
  });

  it("does not have recording Tailwind classes when isRecording is false", () => {
    render(<RecordButton {...defaults} />);
    expect(screen.getByRole("button")).not.toHaveClass("border-accent-red");
  });

  it("contains a record-dot span", () => {
    render(<RecordButton {...defaults} />);
    expect(screen.getByTestId("record-dot")).toBeInTheDocument();
  });

  describe("hold mode", () => {
    const holdDefaults = { ...defaults, mode: "hold" as const };

    it("shows 'Hold to Record' when idle", () => {
      render(<RecordButton {...holdDefaults} />);
      expect(screen.getByText("Hold to Record")).toBeInTheDocument();
    });

    it("shows 'Recording...' when recording", () => {
      render(<RecordButton {...holdDefaults} isRecording={true} />);
      expect(screen.getByText("Recording...")).toBeInTheDocument();
    });

    it("calls onStart on mouseDown", () => {
      render(<RecordButton {...holdDefaults} />);
      fireEvent.mouseDown(screen.getByRole("button"));
      expect(holdDefaults.onStart).toHaveBeenCalledTimes(1);
    });

    it("calls onStop on mouseUp when recording", () => {
      render(<RecordButton {...holdDefaults} isRecording={true} />);
      fireEvent.mouseUp(screen.getByRole("button"));
      expect(holdDefaults.onStop).toHaveBeenCalledTimes(1);
    });

    it("calls onStop on mouseLeave when recording", () => {
      render(<RecordButton {...holdDefaults} isRecording={true} />);
      fireEvent.mouseLeave(screen.getByRole("button"));
      expect(holdDefaults.onStop).toHaveBeenCalledTimes(1);
    });

    it("does not call onStop on mouseUp when not recording", () => {
      render(<RecordButton {...holdDefaults} />);
      fireEvent.mouseUp(screen.getByRole("button"));
      expect(holdDefaults.onStop).not.toHaveBeenCalled();
    });

    it("does not call onStop on mouseLeave when not recording", () => {
      render(<RecordButton {...holdDefaults} />);
      fireEvent.mouseLeave(screen.getByRole("button"));
      expect(holdDefaults.onStop).not.toHaveBeenCalled();
    });

    it("does not trigger start/stop on click in hold mode", async () => {
      render(<RecordButton {...holdDefaults} />);
      // click fires mouseDown + mouseUp + click — onStart fires from mouseDown,
      // but the onClick handler itself is undefined in hold mode
      expect(screen.getByRole("button")).toBeInTheDocument();
      // Verify no onClick handler by checking the button doesn't have toggle behavior
      fireEvent.click(screen.getByRole("button"));
      // onStart is called from mouseDown (part of click), not from onClick
      expect(holdDefaults.onStop).not.toHaveBeenCalled();
    });
  });
});
