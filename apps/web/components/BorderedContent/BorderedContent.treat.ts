import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: theme.border.radius.large,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  overflow: 'hidden',
  '@media': {
    [`screen and (max-width: 991px)`]: {
      borderRadius: 0,
      border: 'none',
    },
  },
})
