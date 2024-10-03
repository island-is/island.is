## Babel

Shared Babel presets.

### @island.is/shared/babel/web

Configures `babel-plugin-transform-imports` to use deep imports instead of importing from index files.

### Deep Imports

Consider a web app that code-splits per page (like NextJS). If PageA uses SectionA and PageB uses SectionB, both components from a UI library, it results in:

PageA imports:

- UI (from index)

PageB imports:

- UI (from index)

This results in each page containing code irrelevant to it, as imported from `index.ts`. Tree-shaking doesn't eliminate code unused across the app.

For developer experience (DX) and isolation, importing from `index.ts` is ideal. For optimal code-splitting, import directly from module definitions, resulting in:

PageA imports:

- SectionA

PageB imports:

- SectionB

Configure `babel-plugin-transform-imports` to modify import statements using `exportFinder` to locate each module's defining export.
