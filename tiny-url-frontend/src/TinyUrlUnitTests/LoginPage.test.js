import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import LoginPage from "../components/LoginPage";

// Mocking useNavigate to avoid errors during testing
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => mockNavigate,
  }));

  beforeAll(() => {
    global.fetch = jest.fn();
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
    fetch.mockClear();
    sessionStorage.clear();
    mockNavigate.mockClear();
  });

describe("TinyUrlLoginPage", () => {

    test("testing whether content is shown intitally when page is loaded", () => {

        render(
            <BrowserRouter>
                <LoginPage/>
            </BrowserRouter>
        );

        expect(screen.getByText(/please login to your account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();  
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
        expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();

    });

    test("redirects if already logged in", async () => {

        // Mock the sessionStorage to simulate a logged in user
        sessionStorage.getItem.mockImplementation((key) => {
            if (key === "token") return "dummy-token";
            return null;
          });
    
        render(<LoginPage/>, { wrapper: MemoryRouter });
    
        // expecting navigation 
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/tinyurl-home');
      });

      test("handles user input and form submission successfully", async () => {
    
        //Mock fetch for intial connection check
        fetch.mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve("fake-jwt-token"),
        });
    
        render(<LoginPage />, { wrapper: MemoryRouter });
    
        // Simulate user input and form submission
        fireEvent.change(screen.getByLabelText("Username"), { target: { value: "Chikku" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test123"}});

        // simulate form submission
        fireEvent.click(screen.getByRole("button", { name: /Log In/i }));
        
        await waitFor(() => {

            // Verify that sessionStorage.setItem was called with expected token

            expect(sessionStorage.setItem).toHaveBeenCalledTimes(2);
            expect(sessionStorage.setItem).toHaveBeenCalledWith("token", "fake-jwt-token");
            expect(sessionStorage.setItem).toHaveBeenCalledWith("Connected", true);
        
            // Verify navigation to home page after successful login
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/tinyurl-home');
          });
        
      });

      test("failed form submission", async () => {
        fetch.mockRejectedValueOnce(new Error("invalid password"));

        render(<LoginPage />, { wrapper: MemoryRouter });
    
        // Simulate user input and form submission
        fireEvent.change(screen.getByLabelText("Username"), { target: { value: "Chikku" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test123"}});

        // simulate form submission
        fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

        await waitFor(() => {
            expect(screen.getByText("invalid password")).toBeInTheDocument();
        });
      });

});