import { style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const dotState = styleVariants({
  active: {},
  inactive: {},
})
export const navItem = style({})

export const navItemActive = styleVariants({
  active: {
    backgroundColor: '#E0ECFF',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  inactive: {
    backgroundColor: `${theme.color.blue100}`,
    '@media': {
      [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
        backgroundColor: 'white',
      },
    },
  },
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
