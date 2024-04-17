import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const subTab = style({
  backgroundColor: 'transparent',
  ':hover': {
    backgroundColor: theme.color.white,
  },
})

export const alternativeTabItem = style({
  selectors: {
    '&:first-child': {
      borderLeft: 'none',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
})

export const tab = style({
  position: 'relative',
  padding: '10px',
  minHeight: `${theme.spacing[7]}px`,
  width: '100%',
  outline: 0,
  fontWeight: 'lighter',
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
  selectors: {
    '&:first-child': {
      borderLeft: 'none',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
})
