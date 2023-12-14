import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const gridContainer = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    xs: {
      background: '#10069F',
    },
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '65fr 35fr',
      background:
        "url('https://images.ctfassets.net/8k0h54kbe6bj/6YIjuVoxG20hO48vdEDasA/9e2808caabce9438bdb7c2ece3ac3c06/HBS-bg-banner.svg') no-repeat,linear-gradient(94deg, #0A009F -4.58%, #10069F 30.97%, rgba(16, 6, 159, 0.92) 54.34%, rgba(41, 61, 166, 0.83) 68.13%, rgba(55, 86, 165, 0.68) 77.79%, rgba(99, 102, 165, 0.32) 94.6%)",
    },
  }),
})
