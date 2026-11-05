# My Pages app shell

The shell around My Pages: layout, header, sidemenu, search and dashboard. Feature screens are not here; they're module libraries in `libs/portals/my-pages/` (see its AGENTS.md for registration and visibility rules).

- The NX project is named `service-portal`, not `portals-my-pages` (`yarn nx serve service-portal`).
- Nav and dashboard ordering, and which cards Dashboard V2 shows at all, come from Contentful namespaces keyed by path (`useDynamicRoutes` in `libs/portals/my-pages/core`, `src/screens/Dashboard/DashboardV2/useDashboardNav.ts`), not from code.
