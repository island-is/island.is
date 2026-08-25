import { globalStyle, style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const tableWrapper = style({})

globalStyle(`${tableWrapper} table`, {
  tableLayout: 'fixed',
  width: '100%',
})

globalStyle(`${tableWrapper} input:not([type="checkbox"])`, {
  fontSize: 12,
  padding: '8px 8px 8px 16px',
  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 14,
    },
  }),
})

// Input.mixins.ts's containerSizes also adds its own padding on the div
// wrapping the input, stacking on top of the input's own padding above —
// neither is overridable individually through InputController's props, so
// zero the wrapper's out to make the input's padding the only one that counts.
globalStyle(`${tableWrapper} div:has(> input:not([type="checkbox"]))`, {
  padding: 0,
})

export const checkboxColumnStyle = { width: 48 }
export const inputColumnHeaderStyle = { width: 152 }

export const footerRowTestId = 'static-table-footer-row'

globalStyle(`${tableWrapper} tr[data-testid="${footerRowTestId}"] td`, {
  borderBottomWidth: 0,
})
