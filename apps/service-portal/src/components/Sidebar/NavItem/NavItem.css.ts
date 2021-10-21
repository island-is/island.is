import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const dotState = styleMap({
  active: {},
  inactive: {},
})

export const navItem = style({})

export const subNavItem = style({
  fontSize: 16,
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
