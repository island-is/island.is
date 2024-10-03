````markdown
# Vanilla Extract Utils

This module provides utility functions built on top of `@vanilla-extract/css`. These utilities are designed to be imported and used exclusively within `*.css.ts` files to help manage and apply CSS styles in a more responsive and organized manner.

## responsiveStyleMap

The `responsiveStyleMap` utility augments Vanilla Extract's `style` function by incorporating breakpoint-specific style variations. This enables developers to define different style values depending on the screen size.

### Example Usage

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
})
```
````

In the example above, the `height` property will be set to `80px` for extra-small screens (xs) and `112px` for medium screens (md).

## Running Unit Tests

To run unit tests using [Jest](https://jestjs.io), execute the following command:

```bash
nx test island-ui-vanilla-extract-utils
```

```

```
