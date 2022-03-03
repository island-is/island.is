import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  height: '100vh',
  backgroundColor: theme.color.purple100,
})

export const wrapper = style({
  display: 'flex',
  justifyContent: 'space-between',
  maxWidth: '1440px',
  paddingTop: theme.spacing[6],
  margin: `0 auto`,
})

export const boxWidthPercent = style({
  width: '100%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: 'calc(75% - 24px)',
    },
  },
})

export const sideBarWidth = style({
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'block',
      width: 'calc(25% - 24px)',
    },
  },
})
