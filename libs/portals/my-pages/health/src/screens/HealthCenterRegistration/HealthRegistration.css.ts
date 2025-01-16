import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const strongStyle = style({
  marginRight: '0.5rem',
})

export const tableRowStyle = style({
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue100,
    },
  },
})

export const saveButtonWrapperStyle = recipe({
  base: {
    position: 'relative',
  },
  variants: {
    visible: {
      true: {
        opacity: 1,
        zIndex: 1,
      },
      false: {
        opacity: 0,
        zIndex: -1,
      },
    },
  },
})

export const filterWrapperStyle = style({
  width: '100%',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: '50%',
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      width: '33.33333%',
    },
  },
})
