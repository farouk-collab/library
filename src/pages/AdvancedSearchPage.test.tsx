import { screen, fireEvent, waitFor } from "@testing-library/react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "../routes";
import { vi } from "vitest";
import { renderWithProviders } from "../test/testUtils";

const mockSearchResponse = {
  numFound: 1,
  docs: [
    {
      key: "/works/OL123W",
      title: "Test Book",
      author_name: ["Test Author"],
      first_publish_year: 2000,
      cover_i: 123,
    },
  ],
};

describe("AdvancedSearchPage", () => {
  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return {
        ok: true,
        json: async () => mockSearchResponse,
      } as any;
    }) as any;
  });

  it("searches and shows results", async () => {
    await router.navigate({ to: "/advanced" });

    renderWithProviders(<RouterProvider router={router} />);

    const titleInput = await screen.findByPlaceholderText(/^Titre$/i);
    fireEvent.change(titleInput, { target: { value: "harry" } });

    fireEvent.click(screen.getByText(/Rechercher →/i));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const calledUrl = (global.fetch as any).mock.calls[0][0];
    expect(decodeURIComponent(calledUrl)).toContain('title:"harry"');

    expect(await screen.findByText("Test Book")).toBeInTheDocument();
    expect(await screen.findByText(/Test Author/i)).toBeInTheDocument();
  });
});
