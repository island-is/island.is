import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const footerBg = style({
  background: 'linear-gradient(263.52deg, #0C588D 0%, #2A8DD2 105.7%);',
})

export const logoStyle = style({
  filter: 'brightness(0) invert(1)',
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
