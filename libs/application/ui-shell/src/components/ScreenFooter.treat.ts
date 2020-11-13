import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const buttonContainer = style({
  borderTop: `2px solid ${theme.color.purple100}`,
  borderBottomLeftRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,
  paddingBottom: 'env(safe-area-inset-bottom)',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingBottom: theme.spacing[4],
    },
  },
})
