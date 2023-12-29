import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  rowGap: theme.spacing[3],
  marginBottom: theme.spacing[6],

  selectors: {
    '&:only-child': {
      marginBottom: 0,
    },
  },
})
