import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SendButton } from "../../components/SendButton";

describe("SendButton", () => {
  const defaults = {
    disabled: false,
    isSending: false,
    onSend: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders a Send button", () => {
    render(<SendButton {...defaults} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<SendButton {...defaults} disabled={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when isSending is true", () => {
    render(<SendButton {...defaults} isSending={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is enabled when not disabled and not sending", () => {
    render(<SendButton {...defaults} />);
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("calls onSend on click", async () => {
    render(<SendButton {...defaults} />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(defaults.onSend).toHaveBeenCalledTimes(1);
  });

  it("shows 'Sending...' when isSending is true", () => {
    render(<SendButton {...defaults} isSending={true} />);
    expect(screen.getByRole("button")).toHaveTextContent("Sending...");
  });

  it("shows 'Send' when isSending is false", () => {
    render(<SendButton {...defaults} isSending={false} />);
    expect(screen.getByRole("button")).toHaveTextContent("Send");
  });

  it("does not call onSend when disabled", async () => {
    render(<SendButton {...defaults} disabled={true} />);
    await userEvent.click(screen.getByRole("button"));
    expect(defaults.onSend).not.toHaveBeenCalled();
  });
});
