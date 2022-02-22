import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridColumn: '1/-1',
  gridTemplateColumns: 'repeat(4, 1fr)',
  width: '100%',
  columnGap: theme.spacing[3],
  rowGap: theme.spacing[4],
  paddingBottom: theme.spacing[4],
  marginBottom: theme.spacing[3],
  overflowX: 'scroll',
})

export const fullWidth = style({
  gridColumn: '1/-1',
})

export const animatedHeight = style({
  marginTop: theme.spacing[4],
})

export const toggleButton = style({
  gridColumn: '1/-1',
  display: 'block',
  position: 'relative',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      marginLeft: -theme.spacing[7],
    },
  },
})

export const toggleWrapper = style({
  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: '32px auto',
  columnGap: theme.spacing[3],
  borderBottom: `1px solid ${theme.color.dark200}`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      borderBottom: 'none',
    },
  },
})
export const headlineBorder = style({
  borderBottom: `1px solid ${theme.color.dark200}`,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      borderBottom: 'none',
    },
  },
})

export const iconContainer = style({
  marginTop: '-4px',
  width: theme.spacing[4],
  height: theme.spacing[4],
  borderRadius: theme.spacing[1],
  transition: 'transform 150ms ease, background-color 250ms ease',
})

globalStyle(`${toggleButton}:hover ${iconContainer}`, {
  backgroundColor: theme.color.purple200,
})

export const rotate = style({
  transform: 'rotate(180deg)',
})

export const button = style({
  color: theme.color.blue400,
  selectors: {
    '&:hover': {
      color: theme.color.blueberry400,
    },
  },
})
