import { style, globalStyle } from 'treat'
import { theme } from '../../theme'

export const footer = style({})

export const link = style({})

export const icon = style({
  pointerEvents: 'none',
  opacity: 0,
  display: 'inline',
  marginLeft: '8px',
  overflow: 'visible',
  transition: 'opacity 150ms ease',
  selectors: {
    [`${link}:hover &`]: {
      opacity: 1,
    },
  },
})

globalStyle(`${footer} a:hover`, {
  textDecorationColor: theme.color.white,
})
