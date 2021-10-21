import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  position: 'relative',
  paddingBottom: 4,
  display: 'inline-block',
  color: theme.color.blue400,
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
  paddingLeft: 4,
})
