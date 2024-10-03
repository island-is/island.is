```markdown
# Vanilla Extract Utils

This module contains utility functions that depend on `@vanilla-extract/css`. These utilities should only be imported from `*.css.ts` files.

## `responsiveStyleMap`

This utility wraps Vanilla Extract's `style` function, allowing each style to include breakpoint-specific styles. Here's an example usage:

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils';

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
});
```

## Running Unit Tests

To execute the unit tests with [Jest](https://jestjs.io), run the following command:

```bash
nx test island-ui-vanilla-extract-utils
```
```