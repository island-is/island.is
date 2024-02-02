import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tab = style({
  position: 'relative',
  padding: '10px',
  minHeight: `${theme.spacing[7]}px`,
  width: '100%',
  outline: 0,
  fontWeight: 'lighter',
  backgroundColor: theme.color.blue100,
  borderBottom: `1px solid ${theme.color.blue200}`,
})

export const tabNotSelected = style({
  selectors: {
    '&:not(last-child):after': {
      content: '""',
      position: 'absolute',
      width: '1px',
      margin: `${theme.spacing[1]}px 0`,
      top: 0,
      bottom: 0,
      right: -1,
      zIndex: theme.zIndex.above,
      backgroundColor: theme.color.blue200,
    },
  },
})

export const tabSelected = style({
  color: theme.color.blue400,
  backgroundColor: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  borderBottom: 'none',
  fontWeight: theme.typography.semiBold,
  zIndex: '2',
  selectors: {
    '&:first-child': {
      borderLeft: 'none',
    },
    '&:last-child': {
      borderRight: 'none',
    },
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
