# Unified naming strategy for files and directories

- Status: accepted
- Deciders: devs
- Date: 2020-07-03

## Context and Problem Statement

As of the date of this writing, there are multiple different naming styles used in the monorepo, mostly because NX has defaults that differ between schematic types. In order for navigating the monorepo in a consistent rational manner, we should align on naming strategy for files and directories.

## Decision Drivers

- Provide consistency when navigating the codebase
- The earlier we decide on this, the better

## Considered Options

Some mixture of these:

- kebab-case
- PascalCase
- camelCase
- snake_case

## Decision Outcome

Chosen option: Name files after their default export. If that default export is a React Component, or a class, then the file name should be in PascalCase. Otherwise, the filename should be in camelCase. Basically, for naming files avoid using kebab-case and snake_case and make sure the name follows the default export of the file.

Naming directories should follow these guidelines: Only use kebab-case when naming NX apps and libraries, or folders containing apps and libraries, e.g. `island-ui` instead of `islandUi`: `import { Box } from '@island.is/island-ui/core'`

Use PascalCase for directories only containing React components:

```text
components/CtaButton/index.ts
import 'components/CtaButton'
```

or:

```text
components/CtaButton/CtaButton.tsx
import 'components/CtaButton/CtaButton'
```

rather than

```text
components/cta-button/CtaButton.tsx
```

In all other cases, use camelCase.

### Positive Consequences

- Easier to navigate the codebase
- File names are more readable, and developers know what to expect
- This approach is the most common practice, and something most JS and TS developers are familiar with.
