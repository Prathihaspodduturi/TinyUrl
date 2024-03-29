import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import LogOut from "../components/Logout";


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => mockNavigate,
  }));

  beforeAll(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });
  });

    // Clear mocks before each test
    beforeEach(() => {
        sessionStorage.clear();
        mockNavigate.mockClear();
    });

describe("Logout Page", ()=> {

    test("Logging out to be in the document", () => {
        render(
            <BrowserRouter>
                <LogOut/>
            </BrowserRouter>
        );

        expect(screen.getByText(/Logging out/i)).toBeInTheDocument();
    });

    test("navigating to home page", async () => {
        render(
            <BrowserRouter>
                <LogOut/>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/tinyurl-home');
        }, {timeout : 1100 });
    })
});