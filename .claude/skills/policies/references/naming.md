# Naming and structure (NAME)

Sources: [ADR 0009 naming](https://docs.devland.is/technical-overview/adr/0009-naming-files-and-directories.md), [Nx tags](https://docs.devland.is/development/nx-tags.md)

- **NAME-1** Code, comments, docs and API names are British English. Translate Icelandic domain terms (`nationalId` not `kennitala`, `applyForPassport` not `applyForVegabref`). UI text is localised separately (`UI-1`).
- **NAME-2** A file is named after its default export: PascalCase for components and classes, camelCase otherwise. Nest-style suffix files (`*.service.ts`, `*.resolver.ts`) follow the surrounding module.
- **NAME-3** Directories are kebab-case only for Nx projects. Component folders are PascalCase; other folders are camelCase.
- **NAME-4** Every `project.json` has the right `scope:` and `lib:` tags (`yarn check-tags`). Fix module-boundary errors by moving code into an allowed lib, never by loosening tags or adding eslint-disables.
- **NAME-5** Reuse existing libs (`libs/clients/*`, `libs/nest/*`, `libs/island-ui/*`, `libs/shared/*`) before adding new helpers or dependencies.
