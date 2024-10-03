```markdown
# Vanilla Extract Utils

This module provides utility functions built on top of `@vanilla-extract/css`. These utilities are intended to be imported and used exclusively within `*.css.ts` files.

## `responsiveStyleMap`

The `responsiveStyleMap` utility augments Vanilla Extract's `style` function, allowing for the inclusion of styles with breakpoint-specific variations. Below is an example demonstrating its usage:

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils';

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
});
```

## Running Unit Tests

For running unit tests with [Jest](https://jestjs.io), execute the following command:

```bash
nx test island-ui-vanilla-extract-utils
```
```