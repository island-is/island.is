import { style } from '@vanilla-extract/css'

import {
  blue200,
  blue400,
  mint400,
  theme,
  themeUtils,
} from '@island.is/island-ui/theme'

export const root = style({
  display: 'flex',
  width: 240,
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'fixed',
  zIndex: 9999,
  outline: 0,
  border: 'none',
  borderRadius: '100%',
  color: 'white',
  bottom: theme.spacing[2],
  right: theme.spacing[1],
  ...themeUtils.responsiveStyle({
    md: {
      bottom: theme.spacing[3],
      right: theme.spacing[3],
    },
  }),
  transition: 'opacity 0.3s ease',
})

export const hidden = style({
  opacity: 0,
  zIndex: 0,
})

export const message = style({
  background: blue400,
  border: `1px solid ${blue200}`,
  borderRadius: 8,
  position: 'absolute',
  bottom: 0,
  right: 0,
  maxWidth: 220,
  outline: 0,
  padding: 8,
  ...themeUtils.responsiveStyle({
    md: {
      padding: 16,
    },
  }),
  textAlign: 'center',
  transition: 'bottom 0.3s ease, transform 0.3s ease',
  transform: 'translateY(0)',
  ':focus': {
    outline: 0,
    transform: 'translateY(-10px)',
  },
})

export const messagePushUp = style({
  bottom: 80,
  ...themeUtils.responsiveStyle({
    md: {
      bottom: 0,
    },
  }),
})

export const messageArrow = style({
  position: 'absolute',
  bottom: -10,
  right: 44,
  width: 0,
  height: 0,
  zIndex: 0,
  borderLeft: '10px solid transparent',
  borderRight: '10px solid transparent',
  borderTop: `10px solid ${blue200}`,
  transition: 'all 150ms ease',
  selectors: {
    [`${message}:focus &`]: {
      bottom: -13,
      right: 41,
      borderLeft: '13px solid transparent',
      borderRight: '13px solid transparent',
      borderTop: `13px solid ${mint400}`,
    },
  },
})

export const messageArrowBorder = style({
  position: 'absolute',
  bottom: -8,
  right: 44,
  width: 0,
  height: 0,
  zIndex: 1,
  borderLeft: '10px solid transparent',
  borderRight: '10px solid transparent',
  borderTop: `10px solid ${blue400}`,
})

export const loadingDots = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  margin: 'auto',
  left: 0,
  right: 0,
})

export const circleRoot = style({
  display: 'flex',
  width: 120,
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'fixed',
  zIndex: 9999,
  outline: 0,
  border: 'none',
  borderRadius: '100%',
  color: 'white',
  right: 0,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${theme.color.mint400}`,
    },
  },
})

export const circleRootPushUp = style({
  bottom: 72,
  ...themeUtils.responsiveStyle({
    md: {
      bottom: 0,
    },
  }),
})

export const circleRootNoPushUp = style({
  bottom: 0,
})
