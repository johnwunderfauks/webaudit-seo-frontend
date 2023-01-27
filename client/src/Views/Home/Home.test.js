import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./Home";

describe("Home page", () => {
  test("renders correctly", async () => {
    render(<Home />);

    const emailElement = screen
      .getByTestId("form-field-email")
      .querySelector("input");

    expect(emailElement).toBeInTheDocument();

    const urlElement = screen
      .getByTestId("form-field-url")
      .querySelector("input");

    expect(urlElement).toBeInTheDocument();

    const submitButtonElement = screen.getByRole("button");
    expect(submitButtonElement).toBeInTheDocument();
  });

  test("form action", () => {
    render(<Home />);
    const submitButtonElement = screen.getByRole("button");
    userEvent.click(submitButtonElement);

    const emailError = screen.getByText("Enter a valid email");
    expect(emailError).toBeInTheDocument();
    const urlError = screen.getByText("Required Field.");
    expect(urlError).toBeInTheDocument();
  });
});
