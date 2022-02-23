# Vanilla Extract Utils

Contains utils that depend on `@vanilla-extract/css` and can thus only be imported from `*.css.ts` files.

### `responsiveStyleMap`

Wraps Vanilla Extract's `style` function where each style can contain breakpoints:

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
})
```

## Running unit tests

Run `nx test island-ui-vanilla-extract-utils` to execute the unit tests via [Jest](https://jestjs.io).
