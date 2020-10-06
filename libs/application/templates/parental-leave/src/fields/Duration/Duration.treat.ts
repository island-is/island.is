import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const monthsLabelWrapper = style({
  display: 'inline-block',
  position: 'relative',
  ':after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: 5,
    background: theme.color.mint400,
    bottom: 5,
    left: 0,
    opacity: 0.5,
  },
})

export const monthsLabel = style({
  display: 'inline-block',
  position: 'relative',
  zIndex: 1,
})
