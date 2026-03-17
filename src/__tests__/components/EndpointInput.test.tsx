import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EndpointInput } from "../../components/EndpointInput";

describe("EndpointInput", () => {
  it("renders 'API Endpoint' label", () => {
    render(<EndpointInput value="" onChange={() => {}} />);
    expect(screen.getByText("API Endpoint")).toBeInTheDocument();
  });

  it("displays the provided value in the input", () => {
    render(<EndpointInput value="http://example.com" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("http://example.com");
  });

  it("has the expected placeholder", () => {
    render(<EndpointInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("http://localhost:8000/api/audio")).toBeInTheDocument();
  });

  it("calls onChange with new value on typing", async () => {
    const onChange = jest.fn();
    render(<EndpointInput value="" onChange={onChange} />);

    await userEvent.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("associates label with input via htmlFor/id", () => {
    render(<EndpointInput value="" onChange={() => {}} />);
    const input = screen.getByLabelText("API Endpoint");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });
});
