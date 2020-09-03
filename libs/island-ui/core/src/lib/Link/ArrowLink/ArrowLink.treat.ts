import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  position: 'relative',
  paddingBottom: theme.spacing[1],
  '::before': {
    content: "''",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'currentColor',
    height: 2,
  },
})

export const iconWrap = style({
  paddingLeft: theme.spacing[1],
})
