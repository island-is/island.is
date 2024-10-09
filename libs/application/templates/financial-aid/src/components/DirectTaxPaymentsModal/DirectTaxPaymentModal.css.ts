import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const modalBase = style({
  height: '100%',
  display: 'block',
})

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      height: '100%',
    },
  },
})

export const modal = style({
  maxWidth: '752px',
  width: '100%',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
})

export const tableContainer = style({
  width: '100%',
})

export const tableHeaders = style({
  display: 'none',
  borderBottom: `1px solid ${theme.color.blue200}`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      display: ' table-row',
    },
  },
})

export const tableItem = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
})

globalStyle(`${tableContainer} th, td`, {
  paddingRight: theme.spacing[7],
  paddingLeft: theme.spacing[7],
  paddingTop: theme.spacing[3],
  paddingBottom: theme.spacing[3],
})
