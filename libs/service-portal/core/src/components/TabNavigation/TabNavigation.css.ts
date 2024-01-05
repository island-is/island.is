import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tab = style({
  position: 'relative',
  padding: '10px',
  width: '100%',
  outline: 0,
  backgroundColor: theme.color.white,
  ':after': {
    content: '""',
    position: 'absolute',
    height: '1px',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.color.blue200,
  },
})

export const tabSelected = style({
  color: theme.color.blue400,
  ':after': {
    backgroundColor: theme.color.blue400,
  },
})

export const select = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md + 1}px)`]: {
      height: 0,
      overflow: 'hidden',
    },
  },
})

export const tabList = style({
  display: 'inline-flex',
  width: '100%',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      height: 0,
      overflow: 'hidden',
      display: 'none',
    },
  },
})
