```markdown
# Vanilla Extract Utils

This module provides utility functions built on top of `@vanilla-extract/css`. These utilities are designed to be imported and used exclusively within `*.css.ts` files.

## responsiveStyleMap

The `responsiveStyleMap` utility enhances Vanilla Extract's `style` function by incorporating breakpoint-specific style variations. This allows developers to specify different style values based on screen size.

### Example Usage

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils';

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
});
```

In the example above, `height` will be set to `80` for extra-small screens and `112` for medium screens.

## Running Unit Tests

To run unit tests using [Jest](https://jestjs.io), execute the following command:

```bash
nx test island-ui-vanilla-extract-utils
```
```