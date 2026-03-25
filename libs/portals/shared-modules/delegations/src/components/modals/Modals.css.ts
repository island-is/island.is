import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const idCard = style({
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  display: 'flex',
  flexDirection: 'column',
  rowGap: 4,
  padding: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      padding: theme.spacing[3],
    },
  },
})
