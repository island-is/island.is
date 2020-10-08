import { responsiveStyleMap } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const gradient = style({
  background:
    'linear-gradient(118.46deg, #0161FD 28.81%, #3F46D2 59.36%, #812EA4 91.14%, #C21578 122.92%, #FD0050 151.03%);',
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
