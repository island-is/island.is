import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const footerBg = style({
  background: '#D8D9DA',
  color: '#000'
})

export const logoStyle = style({
})

export const footerItemFirst = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: 'none',
      flexBasis: '100%',
    },
  },
})
