import { style } from 'treat'
import { theme } from '@island.is/island-ui/core'

export const footerBg = style({
  background: 'linear-gradient(99.09deg, #24268E 23.68%, #CD1270 123.07%)',
})
export const footerItemFirst = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: 'none',
      flexBasis: '100%',
    },
  },
})
