# Vanilla Extract Utils

Utilities dependent on `@vanilla-extract/css`, to be used exclusively in `*.css.ts` files.

### `responsiveStyleMap`

Enhances Vanilla Extract's `style` function to support responsive design, allowing styles with breakpoints:

```typescript
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'

export const container = responsiveStyleMap({
  display: 'flex',
  height: { xs: 80, md: 112 },
})
```

## Running Unit Tests

Execute `nx test island-ui-vanilla-extract-utils` to run unit tests using [Jest](https://jestjs.io).
