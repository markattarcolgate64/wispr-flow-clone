import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordButton } from "../../components/RecordButton";

describe("RecordButton", () => {
  const defaults = {
    isRecording: false,
    hasRecording: false,
    onStart: jest.fn(),
    onStop: jest.fn(),
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
});
