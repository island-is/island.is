import { style } from '@vanilla-extract/css'
import { theme, zIndex } from '@island.is/island-ui/theme'

export const disclosure = style({
  appearance: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
})

export const popover = style({
  background: theme.color.white,
  borderRadius: theme.border.radius.large,
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
  zIndex: zIndex.above,
  ':focus': {
    outline: 'none',
  },
})
