import React from 'react';
import MyUrlsPage from '../components/MyUrlsPage';
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

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

beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    // mock window alert
    sessionStorage.clear();
    window.alert = jest.fn();
})

describe("test page for MyUrlsPage component", () => {

    test("testing first fetch", async () => {

        /*fetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve("http://example.com/original"),
        });*/

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: "1", originalUrl: "http://example.com/original", shortenedUrl: "http://short.url/abc123" }
            ]),
        })

        render (<MyUrlsPage/>, { wrapper: BrowserRouter });

        expect(screen.getByText("Your URLs are:")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();

        await waitFor(() => {
            // Find by role and partial href attribute value
            const originalUrlLink = screen.getByRole('link', {name: "http://example.com/original"});
            expect(originalUrlLink).toBeInTheDocument();
            expect(originalUrlLink.href).toBe("http://example.com/original");
        });
    });



    test("failure of loading of data", async () => {

        fetch.mockRejectedValueOnce(new Error("unable to connect"));

        render (<MyUrlsPage/>, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByText(/unable to connect/i)).toBeInTheDocument();
        });
        //expect(mockNavigate).toHaveBeenCalledWith('/tinyurl-login', expect.anything());
    });


    test("testing editing and saving of url", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: "1", originalUrl: "http://example.com/original", shortenedUrl: "http://short.url/abc123" }
            ]),
        })

        fetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve("updated succesfully"),
        })

        render (<MyUrlsPage/>, { wrapper: BrowserRouter });

        // Wait for the URL items to be loaded and rendered
        await waitFor(() => {
            expect(screen.getByText("http://example.com/original")).toBeInTheDocument();
            expect(screen.getByText("http://short.url/abc123")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /edit/i }));

        const input = screen.getByDisplayValue("http://example.com/original");
        fireEvent.change(input, { target: { value: 'http://example.com/updated' } });

        expect(screen.getByText(/Editing Original URL:/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            //expect(screen.getByText("data")).toBeInTheDocument();
            //expect(screen.getByText("updated succesfully")).toBeInTheDocument();
            expect(window.alert).toHaveBeenCalledWith("URL Updated Successfully");
        });
    });

    test("testing failure of editing and saving of url", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: "1", originalUrl: "http://example.com/original", shortenedUrl: "http://short.url/abc123" }
            ]),
        })

        //fetch.mockRejectedValueOnce(new Error("unable to connect"));

        // Mock the subsequent failed attempt to save an edited URL
        fetch.mockResolvedValueOnce({
            ok: false,
            text: () => Promise.resolve("Unable to update URL"),
        });

        render (<MyUrlsPage/>, { wrapper: BrowserRouter });

        // Wait for the URL items to be loaded and rendered
        await waitFor(() => {
            expect(screen.getByText("http://example.com/original")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /edit/i }));

        const input = screen.getByDisplayValue("http://example.com/original");
        fireEvent.change(input, { target: { value: 'http://example.com/updated' } });

        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(screen.getByText("Unable to update URL")).toBeInTheDocument();
        });
    });

    test("testing TypeError handling during URL update", async () => {
        // Initial fetch mock for loading URLs
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: "1", originalUrl: "http://example.com/original", shortenedUrl: "http://short.url/abc123" }
            ]),
        });
    
        // Mock fetch to simulate a TypeError for the update request
        fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    
        render(<MyUrlsPage />, { wrapper: BrowserRouter });
    
        // Wait for the component to load URLs
        await waitFor(() => {
            expect(screen.getByText("http://example.com/original")).toBeInTheDocument();
        });
    
        // Initiate an edit
        fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    
        // Mock user input for the update
        const input = screen.getByDisplayValue("http://example.com/original");
        fireEvent.change(input, { target: { value: 'http://example.com/updated' } });
    
        // Attempt to save the update
        fireEvent.click(screen.getByRole("button", { name: /save/i }));
    
        // Check for error handling of TypeError
        await waitFor(() => {
            expect(window.sessionStorage.clear).toHaveBeenCalled();
            expect(screen.getByText(/Redirecting to loginpage/)).toBeInTheDocument();
            expect(mockNavigate).toHaveBeenCalledWith('/tinyurl-login', expect.anything());
        }, {timeout : 2000});
    });
    

    test("testing cancel edit action", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: "1", originalUrl: "http://example.com/original", shortenedUrl: "http://short.url/abc123" }
            ]),
        });
    
        render(<MyUrlsPage />, { wrapper: BrowserRouter });
    
        // Wait for the URL items to be loaded and rendered
        await waitFor(() => {
            expect(screen.getByText("http://example.com/original")).toBeInTheDocument();
        });
    
        // Initiate edit
        fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    
        const input = screen.getByDisplayValue("http://example.com/original");
        // Make changes in the input field
        fireEvent.change(input, { target: { value: 'http://example.com/updated' } });
    
        // Click cancel
        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    
        // Assertions
        await waitFor(() => {
            // Check that the input field is no longer in the document, implying edit mode was exited
            expect(screen.queryByDisplayValue("http://example.com/updated")).toBeNull();
            // Check that the original URL is displayed, indicating the changes were not applied
            expect(screen.getByText("http://example.com/original")).toBeInTheDocument();
        });
    });

    test("testing deleting of url", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: "1", originalUrl: "http://example.com/original", shortenedUrl: "http://short.url/abc123" }
            ]),
        })

        fetch.mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve("deleted succesfully"),
        })

        render (<MyUrlsPage/>, { wrapper: BrowserRouter });

        // Wait for the URL items to be loaded and rendered
        await waitFor(() => {
            expect(screen.getByText("http://example.com/original")).toBeInTheDocument();
            expect(screen.getByText("http://short.url/abc123")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /delete/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("URL deleted successfully");
        });
    });

    test("testing failure of deleting of url", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: "1", originalUrl: "http://example.com/original", shortenedUrl: "http://short.url/abc123" }
            ]),
        })

        fetch.mockResolvedValueOnce({
            ok: false,
            text: () => Promise.resolve("Unable to delete URL"),
        })

        render (<MyUrlsPage/>, { wrapper: BrowserRouter });

        // Wait for the URL items to be loaded and rendered
        await waitFor(() => {
            expect(screen.getByText("http://example.com/original")).toBeInTheDocument();
            expect(screen.getByText("http://short.url/abc123")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /delete/i }));

        await waitFor(() => {
            expect(screen.getByText("Unable to delete URL")).toBeInTheDocument();
        });
    });

    test("testing failure of deleting of url due to TypeError", async () => {

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([
                { id: "1", originalUrl: "http://example.com/original", shortenedUrl: "http://short.url/abc123" }
            ]),
        })

        // Mock fetch to simulate a TypeError for the delete request
        fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

        render (<MyUrlsPage/>, { wrapper: BrowserRouter });

        // Wait for the URL items to be loaded and rendered
        await waitFor(() => {
            expect(screen.getByText("http://example.com/original")).toBeInTheDocument();
            expect(screen.getByText("http://short.url/abc123")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /delete/i }));

        // Check for error handling of TypeError
        await waitFor(() => {
            expect(window.sessionStorage.clear).toHaveBeenCalled();
            expect(screen.getByText(/Redirecting to loginpage/)).toBeInTheDocument();
            expect(mockNavigate).toHaveBeenCalledWith('/tinyurl-login', expect.anything());
        }, {timeout : 2000});
    });

})