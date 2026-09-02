import { globalStyle, style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const tableWrapper = style({})

globalStyle(`${tableWrapper} table`, {
  tableLayout: 'fixed',
  width: '100%',
  minWidth: 700,
})

globalStyle(`${tableWrapper} th`, {
  height: 56,
  padding: 16,
})

globalStyle(`${tableWrapper} td`, {
  height: 56,
  padding: '12px 16px',
})

globalStyle(`${tableWrapper} [data-column-index="0"]:not(:first-child)`, {
  paddingLeft: 8,
})

globalStyle(`${tableWrapper} input:not([type="checkbox"])`, {
  fontSize: 12,
  padding: 8,
  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 14,
    },
  }),
})

globalStyle(`${tableWrapper} div:has(> input:not([type="checkbox"]))`, {
  padding: 0,
})

export const cellButtonLabel = style({
  textDecoration: 'underline',
})

export const checkboxColumnStyle = { width: 56 }
export const inputColumnHeaderStyle = { width: 155 }

export const footerRowTestId = 'interactive-table-footer-row'

globalStyle(`${tableWrapper} tr[data-testid="${footerRowTestId}"] td`, {
  borderBottomWidth: 0,
})
