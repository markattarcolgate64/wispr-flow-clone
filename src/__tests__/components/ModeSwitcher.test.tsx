import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeSwitcher } from "../../components/ModeSwitcher";

describe("ModeSwitcher", () => {
  const defaults = {
    mode: "toggle" as const,
    onChange: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders Click and Hold buttons", () => {
    render(<ModeSwitcher {...defaults} />);
    expect(screen.getByText("Click")).toBeInTheDocument();
    expect(screen.getByText("Hold")).toBeInTheDocument();
  });

  it("applies active class to the selected mode", () => {
    const { rerender } = render(<ModeSwitcher {...defaults} mode="toggle" />);
    expect(screen.getByText("Click")).toHaveClass("bg-border");
    expect(screen.getByText("Hold")).not.toHaveClass("bg-border");

    rerender(<ModeSwitcher {...defaults} mode="hold" />);
    expect(screen.getByText("Hold")).toHaveClass("bg-border");
    expect(screen.getByText("Click")).not.toHaveClass("bg-border");
  });

  it("calls onChange with 'hold' when Hold is clicked", async () => {
    render(<ModeSwitcher {...defaults} mode="toggle" />);
    await userEvent.click(screen.getByText("Hold"));
    expect(defaults.onChange).toHaveBeenCalledWith("hold");
  });

  it("calls onChange with 'toggle' when Click is clicked", async () => {
    render(<ModeSwitcher {...defaults} mode="hold" />);
    await userEvent.click(screen.getByText("Click"));
    expect(defaults.onChange).toHaveBeenCalledWith("toggle");
  });

  it("disables both buttons when disabled prop is true", () => {
    render(<ModeSwitcher {...defaults} disabled={true} />);
    expect(screen.getByText("Click")).toBeDisabled();
    expect(screen.getByText("Hold")).toBeDisabled();
  });

  it("does not call onChange when disabled", async () => {
    render(<ModeSwitcher {...defaults} disabled={true} />);
    await userEvent.click(screen.getByText("Hold"));
    expect(defaults.onChange).not.toHaveBeenCalled();
  });
});
