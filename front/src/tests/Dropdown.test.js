/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Dropdown from "../components/Dropdown/index";

describe("Dropdown component", () => {
  it("renders the default text correctly", () => {
    const { getByText } = render(<Dropdown />);
    expect(getByText("Select your news")).toBeInTheDocument();
  });

  it("opens the dropdown menu on click", () => {
    const { getByText, getByRole } = render(<Dropdown />);
    const button = getByRole("button");
    fireEvent.click(button);
    expect(getByText("Angular")).toBeInTheDocument();
  });

  it("changes the text on option click", () => {
    const { getAllByText, getByRole } = render(<Dropdown setOption={jest.fn()} handleGetNews={jest.fn()} />);
    const button = getByRole("button");
    fireEvent.click(button);
    const vueOptions = getAllByText("Vue");
    fireEvent.click(vueOptions[0]);
    expect(getAllByText("Vue")).toHaveLength(1);
  });
});
