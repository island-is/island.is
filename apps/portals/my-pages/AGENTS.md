# My Pages app shell

The shell around My Pages: layout, header, sidemenu, search and dashboard. Feature screens are not here; they're module libraries in `libs/portals/my-pages/` (see its AGENTS.md for registration and visibility rules).

- The NX project is named `service-portal`, not `portals-my-pages` (`yarn nx serve service-portal`).
- Contentful namespaces keyed by path set nav and dashboard order and Dashboard V2's featured cards, but only among items the code already shows (`useDynamicRoutes` in `libs/portals/my-pages/core`, `src/screens/Dashboard/DashboardV2/useDashboardNav.ts`).
