import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("renders input field", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("accepts user input", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");

    fireEvent.change(input, { target: { value: "test value" } });
    expect(input).toHaveValue("test value");
  });

  it("can be disabled", () => {
    render(<Input disabled placeholder="Disabled input" />);
    expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled();
  });

  it("applies type attribute", () => {
    render(<Input type="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Input ref={ref} placeholder="Test input" />);
    expect(ref.current).toBeTruthy();
  });
});
