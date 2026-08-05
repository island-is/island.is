import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

const MOBILE = `screen and (max-width: ${theme.breakpoints.md}px)`

export const minimalScrollbar = style({
  height: 'calc(100vh - 200px)',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  scrollbarColor: 'rgba(0,0,0,0.2) transparent',
  '@media': {
    [MOBILE]: {
      height: 'auto',
      maxHeight: '50vh',
    },
  },
  selectors: {
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0,0,0,0.2)',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(0,0,0,0.4)',
    },
  },
})
