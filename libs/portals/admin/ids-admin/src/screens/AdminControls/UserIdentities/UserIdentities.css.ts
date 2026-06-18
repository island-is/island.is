import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tableContainer = style({})

globalStyle(`${tableContainer} thead th, ${tableContainer} tbody td`, {
  paddingInline: 16,
})

export const subjectIdCell = style({
  display: 'flex',
  alignItems: 'center',
  columnGap: 4,
  maxWidth: 180,
})

export const claimsTable = style({})

export const claimsTypeCol = style({
  width: '50%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      width: '30%',
    },
  },
})

export const claimsValueCol = style({
  width: '50%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      width: '70%',
    },
  },
})

globalStyle(`${claimsTable} table`, {
  tableLayout: 'fixed',
  width: '100%',
})

globalStyle(`${claimsTable} th:first-child, ${claimsTable} td:first-child`, {
  whiteSpace: 'nowrap',
})
