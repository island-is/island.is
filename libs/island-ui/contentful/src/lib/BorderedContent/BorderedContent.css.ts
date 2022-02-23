import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: theme.border.radius.large,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  '@media': {
    [`screen and (max-width: 991px)`]: {
      borderRadius: 0,
      border: 'none',
    },
  },
})

export const bottomContent = style({
  backgroundColor: theme.color.blue100,
  position: 'relative',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      // Background should bleed outside of grid on mobile
      '::before': {
        content: "''",
        backgroundColor: theme.color.blue100,
        position: 'absolute',
        left: -theme.grid.gutter.mobile * 2,
        right: -theme.grid.gutter.mobile * 2,
        top: 0,
        bottom: 0,
      },
    },
  },
})
