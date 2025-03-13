import { style, styleVariants } from '@vanilla-extract/css'

import { blue100, blue600, theme, themeUtils } from '@island.is/island-ui/theme'

export const item = style({
  textAlign: 'center',
  color: blue600,
  fontWeight: 300,
  position: 'relative',
  height: 104,
  padding: '0px 50px',
  width: 416,
  display: 'flex',
  justifyContent: 'center',
  zIndex: 2,
  ...themeUtils.responsiveStyle({
    lg: {
      position: 'absolute',
    },
  }),
})

export const basicItem = style({
  padding: '12px 24px',
  minHeight: 64,
  maxWidth: 316,
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
})

export const detailedItem = style({
  position: 'absolute',
  maxWidth: 316,
  borderRadius: 50,
  background: blue100,
  minHeight: 64,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
})

export const itemText = style({
  justifyContent: 'center',
  flexGrow: 1,
  padding: '0px 24px',
})

export const monthItem = style({
  position: 'absolute',
  top: 40,
  transform: 'translate(-50%, 0)',
  zIndex: 1,
  left: '50%',
  textAlign: 'center',
  ...themeUtils.responsiveStyle({
    lg: {
      top: 'unset',
      bottom: 370,
    },
  }),
})

export const yearText = style({
  fontSize: 24,
  height: 40,
  textAlign: 'center',
})

export const monthText = style({
  border: '1px solid #CCDFFF',
  padding: '8px 15px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'white',
  borderRadius: 50,
})

export const timelineGradient = style({
  position: 'absolute',
  width: '100%',
  height: 10,
  top: 345,
  zIndex: 1,
  background:
    'linear-gradient(287.27deg, #0161FD 30.04%, #3F46D2 43.89%, #812EA4 58.3%, #C21578 72.7%, #FD0050 85.44%)',
  ...themeUtils.responsiveStyle({
    lg: {
      top: 345,
    },
  }),
})

export const timelineContainer = style({
  width: '100%',
  height: 700,
  overflow: 'hidden',
  position: 'relative',
  userSelect: 'none',
  cursor: 'move',
})

export const mobileContainer = style({
  top: 140,
  width: '100%',
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export const timelineComponent = style({
  width: '100%',
  overflowX: 'hidden',
  position: 'absolute',
  height: 700,
})

export const bulletLine = style({
  position: 'absolute',
  top: 338,
  transformOrigin: '12px 12px',
  zIndex: 2,
  pointerEvents: 'none',
})

export const arrowButton = style({
  position: 'absolute',
  width: 32,
  lineHeight: 0,
  height: 32,
  backgroundColor: theme.color.white,
  boxShadow: `0 4px 25px rgba(0, 0, 0, 0.1)`,
  borderRadius: '50%',
  zIndex: 10,
  outline: 0,
  ...themeUtils.responsiveStyle({
    md: {
      width: 40,
      height: 40,
    },
  }),
})

export const arrowButtonShadow = styleVariants({
  prev: {
    position: 'absolute',
    background:
      'linear-gradient(90deg, #FFFFFF 50%, rgba(255, 255, 255, 0) 100%)',
    top: 0,
    left: 0,
    height: 140,
    width: 100,
    zIndex: 10,
    ...themeUtils.responsiveStyle({
      lg: {
        height: 700,
        top: 'unset',
        bottom: 0,
      },
    }),
  },
  next: {
    position: 'absolute',
    background:
      'linear-gradient(270deg, #FFFFFF 50%, rgba(255, 255, 255, 0) 100%)',
    top: 0,
    right: 0,
    height: 140,
    width: 100,
    zIndex: 10,
    ...themeUtils.responsiveStyle({
      lg: {
        height: 700,
        top: 'unset',
        bottom: 0,
      },
    }),
  },
})

export const arrowButtonTypes = styleVariants({
  prev: {
    top: 88,
    left: 16,
    ...themeUtils.responsiveStyle({
      md: {
        top: 84,
      },
      lg: {
        top: '330px !important',
      },
    }),
  },
  next: {
    transform: `rotate(-180deg)`,
    top: 88,
    right: 16,
    ...themeUtils.responsiveStyle({
      md: {
        top: 84,
      },
      lg: {
        top: '330px !important',
      },
    }),
  },
})
