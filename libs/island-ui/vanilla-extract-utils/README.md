```markdown
# Vanilla Extract Utils

This module provides utility functions built on top of `@vanilla-extract/css`. These utilities are designed to be imported and used exclusively within `*.css.ts` files.

## responsiveStyleMap

The `responsiveStyleMap` utility enhances Vanilla Extract's `style` function by incorporating breakpoint-specific style variations. Below is an example demonstrating its usage:

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils';

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
});
```

## Running Unit Tests

To run unit tests using [Jest](https://jestjs.io), use the following command:

```bash
nx test island-ui-vanilla-extract-utils
```
```