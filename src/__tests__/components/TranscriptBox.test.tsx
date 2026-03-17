import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TranscriptBox } from "../../components/TranscriptBox";

describe("TranscriptBox", () => {
  const defaults = {
    text: "",
    isStreaming: false,
    error: null,
    onClear: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("shows placeholder text when unused, empty, not streaming, no error", () => {
    render(<TranscriptBox {...defaults} />);
    expect(screen.getByTestId("transcript-content")).toHaveTextContent(
      "Your text will appear here"
    );
  });

  it("has placeholder styling when showing placeholder", () => {
    render(<TranscriptBox {...defaults} />);
    expect(screen.getByTestId("transcript-content")).toHaveClass("italic");
  });

  it("shows actual text when text is provided", () => {
    render(<TranscriptBox {...defaults} text="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("does not have placeholder styling when text is provided", () => {
    render(<TranscriptBox {...defaults} text="Hello" />);
    expect(screen.getByTestId("transcript-content")).not.toHaveClass("italic");
  });

  it("shows blinking cursor when streaming", () => {
    render(<TranscriptBox {...defaults} isStreaming={true} />);
    expect(screen.getByTestId("cursor")).toBeInTheDocument();
  });

  it("does not show cursor when not streaming", () => {
    render(<TranscriptBox {...defaults} />);
    expect(screen.queryByTestId("cursor")).not.toBeInTheDocument();
  });

  it("shows Clear button when text is non-empty", () => {
    render(<TranscriptBox {...defaults} text="Some text" />);
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("does not show Clear button when text is empty", () => {
    render(<TranscriptBox {...defaults} />);
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("calls onClear when Clear button is clicked", async () => {
    render(<TranscriptBox {...defaults} text="Some text" />);
    await userEvent.click(screen.getByText("Clear"));
    expect(defaults.onClear).toHaveBeenCalledTimes(1);
  });

  it("shows error message when error is set", () => {
    render(<TranscriptBox {...defaults} error="Something went wrong" />);
    const errorEl = screen.getByTestId("transcript-error");
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveTextContent("Something went wrong");
  });

  it("does not show error element when error is null", () => {
    render(<TranscriptBox {...defaults} />);
    expect(screen.queryByTestId("transcript-error")).not.toBeInTheDocument();
  });

  it("does not show placeholder after streaming has occurred", () => {
    const { rerender } = render(
      <TranscriptBox {...defaults} isStreaming={true} />
    );
    // Streaming finishes, text is cleared
    rerender(<TranscriptBox {...defaults} text="" isStreaming={false} error={null} onClear={defaults.onClear} />);

    const content = screen.getByTestId("transcript-content");
    expect(content).not.toHaveTextContent("Your text will appear here");
    expect(content).not.toHaveClass("italic");
  });

  it("shows empty box after clear following a stream", () => {
    const { rerender } = render(
      <TranscriptBox {...defaults} isStreaming={true} text="Hello" />
    );
    // Stream finishes with text
    rerender(<TranscriptBox {...defaults} text="Hello" isStreaming={false} error={null} onClear={defaults.onClear} />);
    // User clears
    rerender(<TranscriptBox {...defaults} text="" isStreaming={false} error={null} onClear={defaults.onClear} />);

    const content = screen.getByTestId("transcript-content");
    expect(content).toHaveTextContent("");
    expect(content).not.toHaveClass("italic");
  });
});
