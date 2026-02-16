import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "../routes";
import { renderWithProviders } from "../test/testUtils";

describe("WorkPage", () => {
  it("shows invalid id message for bad olid", async () => {
    await router.navigate({
      to: "/work/$olid",
      params: { olid: "INVALID" },
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(await screen.findByText(/Identifiant invalide/i)).toBeInTheDocument();
  });
});
