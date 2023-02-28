import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const header = style({
  position: 'fixed',
  left: 0,
  zIndex: theme.zIndex.header,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: theme.headerHeight.small,
  backgroundColor: theme.color.blue100,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: theme.headerHeight.large,
    },
  },
  transition: 'all 250ms ease-in-out',
})

export const placeholder = style({
  height: theme.headerHeight.small,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: theme.headerHeight.large,
    },
  },
})

export const infoContainer = style({
  ...themeUtils.responsiveStyle({
    md: {
      borderLeftWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.color.dark100,
    },
  }),
})
