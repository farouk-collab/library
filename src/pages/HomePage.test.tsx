import { screen } from "@testing-library/react";
import HomePage from "./HomePage";
import { renderWithProviders } from "../test/testUtils";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "../routes";
import { describe, it, expect } from "vitest";


describe("HomePage", () => {
  it("renders recent changes heading", async () => {
    await router.navigate({ to: "/" });
    renderWithProviders(<RouterProvider router={router} />);
    expect(screen.getByText(/Changements récents/i)).toBeInTheDocument();
  });
});
