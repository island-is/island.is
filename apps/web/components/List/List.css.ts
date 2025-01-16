import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const ul = style({})

export const ol = style({
  counterReset: 'item',
})
export const li = style({
  display: 'block',
  position: 'relative',
  marginLeft: 30,
  ':before': {
    position: 'absolute',
    left: -10,
    transform: 'translateX(-100%)',
  },
})

globalStyle(`${ol} ${li}:before`, {
  content: 'counters(item, ".") " "',
  counterIncrement: 'item',
  color: theme.color.red400,
  fontWeight: theme.typography.semiBold,
  top: 1,
})

globalStyle(`${ul} ${li}:before`, {
  content: '""',
  backgroundColor: theme.color.red400,
  top: 8,
  width: 8,
  height: 8,
  borderRadius: '50%',
})
