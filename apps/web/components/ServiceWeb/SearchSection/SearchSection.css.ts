import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  position: 'relative',
  zIndex: 1,
  margin: '0 auto',
  maxWidth: 800,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

export const responsiveContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      marginTop: -80,
    },
    lg: {
      margin: '0 auto',
    },
  }),
})

export const logoWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: 150,
  height: 150,
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.color.white,
})

export const logo = style({
  width: 80,
  height: 80,
  display: 'flex',
})

export const mobileLogoWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: 100,
  height: 100,
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.color.white,
})

export const mobilelogo = style({
  width: 60,
  height: 60,
  display: 'flex',
})

export const logoImg = style({
  display: 'inline-block',
  width: '100%',
  height: 'auto',
})
