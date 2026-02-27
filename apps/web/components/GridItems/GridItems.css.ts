import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const gridContainer = style({
  overflow: 'visible',
  padding: 0,
})

export const scrollContainer = style({
  position: 'relative',
})

export const fadeOverlayLeft = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  width: 80,
  pointerEvents: 'none',
  background:
    'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0) 100%)',
  zIndex: 1,
  transition: 'opacity 0.3s ease, width 0.3s ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'none',
    },
  }),
})

export const fadeOverlayRight = style({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: 80,
  pointerEvents: 'none',
  background:
    'linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0) 100%)',
  zIndex: 1,
  transition: 'opacity 0.3s ease, width 0.3s ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'none',
    },
  }),
})

export const container = style({
  width: '100%',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  scrollPaddingInline: theme.grid.gutter.mobile * 2,
  scrollBehavior: 'smooth',
  '::-webkit-scrollbar': {
    display: 'none',
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      scrollBehavior: 'auto',
      scrollSnapType: 'none',
    },
  },
})

export const wrapper = style({
  display: 'grid',
  boxSizing: 'border-box',
  ...themeUtils.responsiveStyle({
    xs: {
      columnGap: theme.spacing[2],
      rowGap: theme.spacing[2],
      paddingLeft: theme.grid.gutter.mobile * 2,
      paddingRight: theme.grid.gutter.mobile * 2,
    },
    sm: {
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
      width: '100%',
      gridTemplateColumns: 'repeat(2, 1fr)',
      paddingRight: theme.grid.gutter.mobile * 2,
    },
    md: {
      paddingLeft: theme.grid.gutter.desktop * 2,
      paddingRight: theme.grid.gutter.desktop * 2,
    },
    lg: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    xl: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  }),
})

export const half = style({
  gridTemplateColumns: 'repeat(2, 1fr)',
  ...themeUtils.responsiveStyle({
    xs: {
      width: theme.breakpoints.sm + 70,
    },
    sm: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    lg: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    xl: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  }),
})

export const quarter = style({
  gridTemplateColumns: 'repeat(4, 1fr)',
  ...themeUtils.responsiveStyle({
    xs: {
      width: theme.breakpoints.sm + 70,
    },
    sm: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    lg: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    xl: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  }),
})

export const third = style({
  gridTemplateColumns: 'repeat(3, 1fr)',
  ...themeUtils.responsiveStyle({
    xs: {
      width: theme.breakpoints.sm + 70,
    },
    sm: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    lg: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    xl: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  }),
})
