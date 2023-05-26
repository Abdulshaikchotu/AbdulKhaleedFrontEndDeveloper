import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// this part is whole testing of the app
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios");

describe("App", () => {
  const mockLaunches = [
    // Sample data for launches
    {
      flight_number: 1,
      mission_name: "Launch 1",
      status: "success",
      original_launch: "true",
      rocket: {
        rocket_name: "Falcon 1",
        rocket_type: "rocket",
        rocket_id: "falcon1",
      },
    },
    {
      flight_number: 2,
      mission_name: "Launch 2",
      status: "failed",
      original_launch: "false",
      rocket: {
        rocket_name: "Falcon 9",
        rocket_type: "rocket",
        rocket_id: "falcon9",
      },
    },
  ];

  const mockRockets = {
    // Sample data for rockets
    falcon1: {
      flickr_images: ["rocket1.jpg"],
    },
    falcon9: {
      flickr_images: ["rocket2.jpg"],
    },
  };

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockLaunches });
    axios.get.mockResolvedValueOnce({ data: mockRockets });
    render(<App />);
  });

  it("renders the app component", () => {
    const appElement = screen.getByTestId("app");
    expect(appElement).toBeInTheDocument();
  });

  it("fetches launches and renders them", async () => {
    const launchElements = await screen.findAllByTestId("launch-item");
    expect(launchElements.length).toBe(mockLaunches.length);
  });

  it("filters launches based on status", async () => {
    // Select 'Success' status
    const statusSelect = screen.getByLabelText("Status");
    fireEvent.change(statusSelect, { target: { value: "success" } });

    const launchElements = await screen.findAllByTestId("launch-item");
    expect(launchElements.length).toBe(1);
    expect(launchElements[0]).toHaveTextContent("Launch 1");
  });

  it("filters launches based on original launch", async () => {
    // Select 'False' for original launch
    const launchSelect = screen.getByLabelText("Original Launch");
    fireEvent.change(launchSelect, { target: { value: "false" } });

    const launchElements = await screen.findAllByTestId("launch-item");
    expect(launchElements.length).toBe(1);
    expect(launchElements[0]).toHaveTextContent("Launch 2");
  });

  it("filters launches based on type", async () => {
    // Select 'Rocket' type
    const typeSelect = screen.getByLabelText("Type");
    fireEvent.change(typeSelect, { target: { value: "rocket" } });

    const launchElements = await screen.findAllByTestId("launch-item");
    expect(launchElements.length).toBe(2);
    expect(launchElements[0]).toHaveTextContent("Launch 1");
    expect(launchElements[1]).toHaveTextContent("Launch 2");
  });

  it("opens and closes launch details popup", async () => {
    // Click on the first launch item to open the popup
    const launchElements = await screen.findAllByTestId("launch-item");
    fireEvent.click(launchElements[0]);

    const popupElement = screen.getByTestId("launch-popup");
    expect(popupElement).toBeInTheDocument();

    // Close the popup
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(popupElement).not.toBeInTheDocument();
  });
});
