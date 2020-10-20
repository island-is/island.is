import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const subSectionContainer = style({
  marginRight: 30,
  overflowY: 'hidden',
  transition: 'height .5s ease-in-out',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginRight: 0,
    },
  },
})

export const subSectionContainerHidden = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const subSectionInnerContainer = style({
  opacity: 0,
  transition: 'opacity .3s ease-in-out',
})

export const subSectionList = style({
  display: 'flex',
  flexDirection: 'row',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'column',
    },
  },
})
