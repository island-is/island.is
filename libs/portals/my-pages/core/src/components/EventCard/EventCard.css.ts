import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const thumbnail = style({
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: theme.spacing['20'],
  height: theme.spacing['20'],
  flex: 'none',
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'block',
    },
  },
})

export const card = style({
  position: 'relative',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderRadius: theme.border.radius.large,
    },
  },
})

export const image = style({
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: '100%',
  flex: 'none',
  paddingBottom: '100%',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const content = style({
  flex: 1,
})
