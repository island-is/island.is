import { globalStyle, style } from '@vanilla-extract/css'

globalStyle('body.my-pages-hero-bg', {
  backgroundColor: '#F2F7FF',
})

globalStyle('body.my-pages-hero-bg main', {
  vars: {
    '--my-pages-hero-blue-height': '380px',
  },
  backgroundColor: 'white',
  backgroundImage:
    'linear-gradient(to bottom, #F2F7FF 0, #F2F7FF var(--my-pages-hero-blue-height), white var(--my-pages-hero-blue-height), white 100%)',
  backgroundRepeat: 'no-repeat',
})

// White panel that covers from the modules section to the bottom of the page,
// full-bleed to viewport edges to overlay the blue main background
export const whiteSection = style({
  backgroundColor: 'white',
  marginLeft: 'calc(50% - 50vw)',
  marginRight: 'calc(50% - 50vw)',
  paddingLeft: 'calc(50vw - 50%)',
  paddingRight: 'calc(50vw - 50%)',
})
