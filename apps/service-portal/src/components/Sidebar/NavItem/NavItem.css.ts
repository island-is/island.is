import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const dotState = styleVariants({
  active: {},
  inactive: {},
})
export const navItem = style({})

export const navItemActive = styleVariants({
  active: {
    backgroundColor: '#E0ECFF',
    border: '1px solid #E0ECFF',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  inactive: {
    border: `1px solid ${theme.color.blue100}`,
    backgroundColor: theme.color.blue100,
    '@media': {
      [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
        backgroundColor: 'white',
        border: 'none',
      },
    },
  },
})

export const text = style({
  fontSize: 16,
  lineHeight: '26px',
  color: theme.color.blue400,
})

export const dot = style({
  left: -35,
  width: theme.spacing['1'],
  height: theme.spacing['1'],
  transition: 'opacity 250ms',
  selectors: {
    [`${navItem}:hover &:not(${dotState.active})`]: {
      opacity: 0.2,
    },
    [`${dotState.active} &`]: {
      opacity: 1,
    },
    [`&:not(${dotState.active})`]: {
      opacity: 0,
    },
  },
})

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 9,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
  },
  inactive: {
    display: 'none',
  },
})
