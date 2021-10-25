import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '100%',
  height: '100%',
  background: theme.color.white,
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'flex',
    },
  }),
})
export const bg = style({
  display: 'none',
  '@media': {
    [`screen and (min-width: 1169px)`]: {
      display: 'block',
      position: 'absolute',
      width: 384,
      top: 571,
      right: 0,
    },
    [`screen and (min-width: 1310px)`]: {
      display: 'block',
      position: 'absolute',
      width: 444,
      top: 552,
      right: 0,
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      display: 'block',
      position: 'absolute',
      width: 546,
      top: 579,
      right: theme.spacing[15],
    },
  },
})

export const mainContainer = style({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: 829,
    },
  }),
})
export const searchContainer = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: 342,
    },
  }),
})

export const asideTop = style({
  position: 'relative',
  zIndex: 0,
  selectors: {
    '&:before': {
      content: '""',
      backgroundColor: theme.color.blue100,
      transform: 'translateX(-50%)',
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: '50%',
      right: 0,
      width: '100vw',
    },
  },
  ...themeUtils.responsiveStyle({
    md: {
      selectors: {
        '&:before': {
          left: 0,
          transform: 'none',
          width: '100vw',
        },
      },
    },
  }),
})

export const asideBottom = style({
  position: 'relative',
  zIndex: 0,
  selectors: {
    '&:before': {
      content: '""',
      backgroundColor: theme.color.blue200,
      transform: 'translateX(-50%)',
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: '50%',
      right: 0,
      width: '100vw',
    },
  },
  ...themeUtils.responsiveStyle({
    md: {
      selectors: {
        '&:before': {
          left: 0,
          transform: 'none',
          width: '100vw',
        },
      },
    },
  }),
})

export const mainLinkContainer = style({
  ...themeUtils.responsiveStyle({
    lg: {
      columnCount: 2,
      columnGap: theme.spacing[2],
      height: 520,
      columnFill: 'auto',
    },
  }),
})
export const mainLinkOuter = style({
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
  paddingLeft: theme.spacing[2],
  borderLeft: `1px solid ${theme.color.blue200}`,
})
export const mainLink = style({
  transition: 'color .3s',
  ':hover': {
    textDecoration: 'none',
    color: theme.color.blue600,
  },
})
export const asideLink = style({
  transition: 'color .3s',
  ':hover': {
    textDecoration: 'none',
    color: theme.color.blue400,
  },
})
