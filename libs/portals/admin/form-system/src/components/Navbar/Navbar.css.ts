import { style } from '@vanilla-extract/css'

export const minimalScrollbar = style({
  height: 'calc(100vh - 200px)',
  overflowY: 'auto',

  // Firefox
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0,0,0,0.05) transparent',

  selectors: {
    // Chrome, Safari, Edge
    '&::-webkit-scrollbar': {
      width: '3px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0,0,0,0.08)',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(0,0,0,0.15)',
    },
  },
})

export const addSectionButton = style({
  position: 'sticky',
  bottom: 0,
  background: 'white',
  flexShrink: 0,
  padding: '1rem',
})

export const navbarContainer = style({
  flex: 1,
  overflowY: 'auto',
  paddingBottom: '1rem',
})
