import { createRouter, createRootRoute, createRoute } from "@tanstack/react-router";
import Layout from "./components/Layout";
import RootError from "./components/RootError";
import HomePage from "./pages/HomePage";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
import WorkPage from "./pages/WorkPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFoundPage from "./pages/NotFoundPage";

const rootRoute = createRootRoute({
  component: Layout,
  errorComponent: RootError,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const advancedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/advanced",
  component: AdvancedSearchPage,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: FavoritesPage,
});

const workRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/work/$olid",
  component: WorkPage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  advancedRoute,
  favoritesRoute,
  workRoute,
  notFoundRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
