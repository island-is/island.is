```markdown
# Vanilla Extract Utils

This module contains utility functions dependent on `@vanilla-extract/css`. These utilities are designed to be imported exclusively in `*.css.ts` files.

## `responsiveStyleMap`

This utility enhances Vanilla Extract's `style` function, enabling styles to include breakpoint-specific adjustments. Here's an example of how to use it:

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils';

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
});
```

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the command below:

```bash
nx test island-ui-vanilla-extract-utils
```
```