import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const iconSize = 24
export const deleteIcon = style({
  cursor: 'pointer',
  left: `${-(iconSize + theme.spacing[1] / 2)}px`,
  position: 'absolute',
  top: iconSize / theme.spacing[1],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      left: `${-(iconSize + theme.spacing[2])}px`,
    },
  },
})
