import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  margin: '0 -100vw',
  padding: `${theme.spacing[6]}px 100vw`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      margin: 0,
      padding: `${theme.spacing[6]}px 0`,
      borderRadius: theme.border.radius.large,
    },
  },
})
