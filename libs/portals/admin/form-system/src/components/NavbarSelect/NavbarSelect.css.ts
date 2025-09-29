import { style } from '@vanilla-extract/css'

export const minimalScrollbar = style({
  height: 'calc(100vh - 200px)',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0,0,0,0.2) transparent',

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
