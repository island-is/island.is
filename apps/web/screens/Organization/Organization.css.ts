import { style } from '@vanilla-extract/css'

import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'

export const gradient = style({
  background:
    'linear-gradient(120.92deg, #0161FD -0.52%, #3F46D2 29.07%, #812EA4 59.85%, #C21578 90.63%, #FD0050 117.86%)',
})

export const tabSectionImg = responsiveStyleMap({
  maxWidth: {
    md: '382px',
  },
  maxHeight: '400px',
  width: '100%',
  float: 'right',
  marginLeft: {
    md: '20px',
  },
  marginRight: {
    lg: '-80px',
  },
})
