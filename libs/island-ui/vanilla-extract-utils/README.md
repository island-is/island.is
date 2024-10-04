# Vanilla Extract Utils

Utilities dependent on `@vanilla-extract/css`, intended for `*.css.ts` files.

## `responsiveStyleMap`

Extends Vanilla Extract's `style` function to support responsive designs with breakpoints:

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
})
```

## Running Unit Tests

Run `nx test island-ui-vanilla-extract-utils` to execute unit tests via [Jest](https://jestjs.io).

