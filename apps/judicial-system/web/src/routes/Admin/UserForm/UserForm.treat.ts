import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const roleContainer = style({
  display: 'flex',
})

export const roleColumn = style({
  flex: 1,

  selectors: {
    '&:nth-child(2)': {
      margin: `0 ${theme.spacing[2]}px`,
    },
  },
})
