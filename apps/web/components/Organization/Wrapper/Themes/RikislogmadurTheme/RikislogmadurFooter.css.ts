import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const footerBg = style({
  background:
    'linear-gradient(178.67deg, rgba(0, 61, 133, 0.2) 1.87%, rgba(0, 61, 133, 0.3) 99.6%)',
})

export const logoStyle = style({
  width: 80,
})

export const footerItemFirst = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: 'none',
      flexBasis: '100%',
    },
  },
})
