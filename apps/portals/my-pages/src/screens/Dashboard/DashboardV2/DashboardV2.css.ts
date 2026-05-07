import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
globalStyle('body.my-pages-hero-bg', {
  backgroundColor: '#F2F7FF',
})

globalStyle('body.my-pages-hero-bg main', {
  vars: {
    '--my-pages-hero-blue-height': '300px',
  },
  backgroundColor: 'white',
  backgroundImage:
    'linear-gradient(to bottom, #F2F7FF 0, #F2F7FF var(--my-pages-hero-blue-height), white var(--my-pages-hero-blue-height), white 100%)',
  backgroundRepeat: 'no-repeat',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      vars: { '--my-pages-hero-blue-height': '320px' },
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      vars: { '--my-pages-hero-blue-height': '345px' },
    },
  },
})

export const whiteSection = style({
  backgroundColor: 'white',
  marginLeft: 'calc(50% - 50vw)',
  marginRight: 'calc(50% - 50vw)',
  paddingLeft: 'calc(50vw - 50%)',
  paddingRight: 'calc(50vw - 50%)',
})
