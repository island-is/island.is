import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const footerBg = style({
  background: 'linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%);',
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
