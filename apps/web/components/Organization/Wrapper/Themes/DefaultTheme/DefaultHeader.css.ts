import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-end',
  justifyContent: 'center',
  order: 1,
  ...themeUtils.responsiveStyle({
    md: {
      order: 0,
    },
  }),
})

export const iconCircle = style({
  height: 136,
  width: 136,
  margin: '0 auto',
  display: 'grid',
  placeItems: 'center',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  position: 'absolute',
  left: '11%',
  bottom: -32,
})

export const headerWrapper = style({
  paddingTop: 130,
})

export const headerLogo = style({
  width: 70,
  maxHeight: 70,
})

export const container = style({
  minHeight: 385,
  marginBottom: 32,
  position: 'relative',
})

export const gridContainer = style({
  display: 'grid',
  gridTemplateRows: '2fr 3fr',
  gridTemplateColumns: '1fr',
  ...themeUtils.responsiveStyle({
    md: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr',
    },
  }),
})

export const headerImage = style({
  objectFit: 'cover',
  height: 200,
  width: '100%',
  order: 0,
  ...themeUtils.responsiveStyle({
    md: {
      order: 1,

      height: '100%',
      maxHeight: 385,
    },
  }),
})

export const textContainer = style({
  marginBottom: 32,
  marginRight: 40,
})
