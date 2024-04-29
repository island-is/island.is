import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  background: 'linear-gradient(180deg, #E6F2FB 21.56%, #90D9E3 239.74%)',
})

export const mainColumn = style({
  paddingTop: '30px',
  paddingBottom: '40px',
})

export const iconContainer = style({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: '8px',
  marginTop: '12px',
})

export const linkContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  ...themeUtils.responsiveStyle({
    md: {
      marginLeft: 0,
    },
    lg: {
      marginLeft: 'auto',
    },
  }),
})

export const linkRow = style({
  marginLeft: '72px',
})

export const bsiLogo = style({
  height: '60px',
})

export const bsiLogoMobile = style({
  height: '40px',
})

export const marginLeft = style({
  marginLeft: theme.spacing[2],
})
