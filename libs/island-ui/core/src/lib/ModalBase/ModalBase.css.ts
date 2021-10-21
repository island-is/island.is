import { theme } from '@island.is/island-ui/theme'
import { style, styleMap } from 'treat'
import { hexToRgba } from '@island.is/island-ui/utils'

export const backdrop = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  transition: `opacity 250ms ease-in-out`,
  opacity: 0,
  zIndex: 10000,
  selectors: {
    '&[data-enter]': {
      opacity: 1,
    },
  },
})

export const backdropColor = styleMap({
  default: {
    backgroundColor: hexToRgba(theme.color.blue100, 0.7),
  },
  white: {
    backgroundColor: theme.color.white,
  },
})

export const modal = style({
  width: '100%',
  opacity: 0,
  outline: 0,
  transition: 'opacity 250ms ease-in-out',
  selectors: {
    '&[data-enter]': {
      opacity: 1,
    },
  },
})
