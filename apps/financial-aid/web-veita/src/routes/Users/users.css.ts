import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  paddingBottom: theme.spacing[6],
  marginBottom: theme.spacing[6],
  overflowX: 'auto',
})

export const tableContainer = style({
  marginBottom: theme.spacing[3],
  marginRight: -theme.spacing[2],
  marginLeft: -theme.spacing[2],
  whiteSpace: 'nowrap',
})

export const tableBody = style({
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
