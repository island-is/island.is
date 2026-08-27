import { globalStyle, style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const tableWrapper = style({})

globalStyle(`${tableWrapper} table`, {
  tableLayout: 'fixed',
  width: '100%',
  minWidth: 700,
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

globalStyle(`${tableWrapper} div:has(> input:not([type="checkbox"]))`, {
  padding: 0,
})

export const checkboxColumnStyle = { width: 48 }
export const inputColumnHeaderStyle = { width: 152 }

export const footerRowTestId = 'interactive-table-footer-row'

globalStyle(`${tableWrapper} tr[data-testid="${footerRowTestId}"] td`, {
  borderBottomWidth: 0,
})
