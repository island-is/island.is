import { style, styleMap } from 'treat'
import {
  blue100,
  blue400,
  blue600,
  theme,
  themeUtils,
} from '@island.is/island-ui/theme'

export const item = style({
  textAlign: 'center',
  color: blue600,
  fontWeight: 300,
  position: 'absolute',
  height: 104,
  width: 316,
  display: 'flex',
  justifyContent: 'center',
  zIndex: 2,
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

export const iconCircle = style({
  height: 64,
  width: 64,
  borderRadius: 50,
  background: 'white',
  boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

export const monthItem = style({
  position: 'absolute',
  transform: 'translate(-50%, 0)',
  zIndex: 1,
  textAlign: 'center',
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

export const arrowButton = style({
  position: 'absolute',
  width: 40,
  lineHeight: 0,
  height: 40,
  backgroundColor: theme.color.white,
  boxShadow: `0 4px 25px rgba(0, 0, 0, 0.1)`,
  borderRadius: '50%',
  zIndex: 10,
  outline: 0,
  display: 'none',
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'inline-block',
    },
  }),
  ':disabled': {
    cursor: 'default',
    backgroundColor: theme.color.dark200,
  },
})

export const arrowButtonShadow = styleMap({
  prev: {
    position: 'absolute',
    background:
      'linear-gradient(90deg, #FFFFFF 34.32%, rgba(255, 255, 255, 0) 96.73%)',
    top: 330,
    left: 0,
    height: 40,
    width: 80,
    zIndex: 1,
  },
  next: {
    position: 'absolute',
    background:
      'linear-gradient(270deg, #FFFFFF 34.32%, rgba(255, 255, 255, 0) 96.73%)',
    top: 330,
    right: 0,
    height: 40,
    width: 80,
    zIndex: 1,
  },
})

export const arrowButtonTypes = styleMap({
  prev: {
    bottom: 40,
    left: 0,
    transform: `rotate(0)`,
    ...themeUtils.responsiveStyle({
      lg: {
        top: 330,
        left: -5,
      },
    }),
  },
  next: {
    bottom: 40,
    right: 0,
    transform: `rotate(-180deg)`,
    ...themeUtils.responsiveStyle({
      lg: {
        top: 330,
        right: 0 - 5,
      },
    }),
  },
})
