import { keyframes, style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const eventBar = style({
  position: 'relative',
  outline: 0,
  zIndex: 0,
  height: 64,
  width: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 50,
  backgroundColor: theme.color.purple400,
  cursor: 'pointer',
})

export const eventBarIcon = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 64,
  width: 64,
  borderRadius: 50,
  backgroundColor: theme.color.white,
  boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.05)',
})

export const eventBarTitle = style({
  alignItems: 'center',
  height: 64,
  borderRadius: 50,
})

export const nowrap = style({
  whiteSpace: 'nowrap',
})

export const eventBarStats = style({
  position: 'relative',
  zIndex: -1,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  height: 64,
  marginLeft: 15,
  paddingRight: 20,
  borderRadius: 50,
  color: 'white',
})

export const title = style({
  fontWeight: theme.typography.semiBold,
  fontSize: 18,
  lineHeight: 1.555555,
  color: theme.color.purple400,
})

export const valueLabel = style({
  display: 'inline-block',
  fontSize: 14,
  color: theme.color.white,
  fontWeight: theme.typography.semiBold,
  lineHeight: 1.142857,
  textAlign: 'left',
})

export const valueWrapper = style({
  display: 'inline-block',
  fontSize: 34,
  lineHeight: 1.294117,
  color: theme.color.white,
  marginRight: 10,
})

export const value = style({
  display: 'inline-block',
  color: theme.color.white,
  fontWeight: theme.typography.semiBold,
})

export const maxValue = style({
  display: 'inline-block',
  fontWeight: theme.typography.light,
  color: theme.color.purple300,
})

// Modal
const modalFade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

export const eventModal = style({
  position: 'relative',
  borderRadius: `32px 5px 5px 5px`,
  boxSizing: 'border-box',
  whiteSpace: 'normal',
  maxWidth: 660,
  margin: 'auto',
  backgroundColor: theme.color.white,
  animationName: modalFade,
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
  top: 64,
  ...themeUtils.responsiveStyle({
    lg: {
      position: 'absolute',
      zIndex: 1,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 660,
    },
  }),
})

export const mobileModalContainer = style({
  zIndex: 11,
})

export const eventModalContent = style({
  textAlign: 'left',
  padding: '10px 48px 48px',
})

export const eventModalClose = style({
  position: 'absolute',
  top: 15,
  right: 15,
  width: 32,
  height: 32,
  lineHeight: 0,
  backgroundColor: theme.color.white,
  borderRadius: '50%',
  outline: 0,
  ...themeUtils.responsiveStyle({
    md: {
      width: 40,
      height: 40,
    },
  }),
})
