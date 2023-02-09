import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  transition: 'margin-left .35s ease .5s',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      transition: 'none',
    },
  },
})

globalStyle(`${container}:last-child .pl`, {
  // This is to overwrite a style that is set by JS and ensures there is no
  // line under the last step in the form stepper.
  height: '0!important',
})

export const name = style({
  marginRight: 20,
  whiteSpace: 'nowrap',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginRight: 0,
      whiteSpace: 'inherit',
    },
  },
})

export const nameWithActiveSubSections = style({
  marginRight: 0,
})

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

export const historyDate = style({
  marginTop: '4px',
})
