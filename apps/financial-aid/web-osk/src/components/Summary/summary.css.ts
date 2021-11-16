import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const iconMargin = style({
  marginRight: theme.spacing[2],
})

export const userInfoContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  rowGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'repeat(7, 1fr)',
    },
  },
})

export const mainInfo = style({
  gridColumn: 'span 4',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 3',
    },
  },
})

export const contactInfo = style({
  gridColumn: 'span 3',
})

export const filesButtons = style({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing[1],
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
