import { style } from '@vanilla-extract/css'

// White panel that covers from the modules section to the bottom of the page,
// full-bleed to viewport edges to overlay the blue main background
export const whiteSection = style({
  backgroundColor: 'white',
  marginLeft: 'calc(50% - 50vw)',
  marginRight: 'calc(50% - 50vw)',
  paddingLeft: 'calc(50vw - 50%)',
  paddingRight: 'calc(50vw - 50%)',
})
