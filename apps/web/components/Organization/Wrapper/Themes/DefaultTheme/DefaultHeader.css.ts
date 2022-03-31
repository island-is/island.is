import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  order: 1,
  '@media': {
    'screen and (min-width: 1000px)': {
      order: 0,
    },
  },
})

export const iconCircle = style({
  height: 136,
  width: 136,
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  ...themeUtils.responsiveStyle({
    xs: {
      marginTop: 12,
    },
    md: {
      marginTop: 84,
      position: 'relative',
    },
  }),
})

export const headerWrapper = style({})

export const headerLogo = style({
  width: 70,
  maxHeight: 70,
})

export const headerImage = style({
  objectFit: 'cover',
  height: '200px',
  width: '100%',
  order: 0,
  '@media': {
    'screen and (min-width: 1000px)': {
      order: 1,
      height: '100%',
    },
  },
})

export const container = style({
  display: 'grid',
  gridTemplateRows: '255px',
})

export const gridContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '200px 1fr',
  '@media': {
    'screen and (min-width: 1000px)': {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '255px',
    },
  },
})
