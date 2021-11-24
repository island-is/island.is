import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const genderContainer = style({
  display: 'flex',
})

export const genderColumn = style({
  flex: 1,

  selectors: {
    '&:nth-child(2)': {
      margin: `0 ${theme.spacing[2]}px`,
    },
  },
})
