import { spacing, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const wrapper = style({
  flex: 1,
  minHeight: 0,
  // height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: spacing[3],

  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0,0,0,0.05) transparent',

  selectors: {
    '&::-webkit-scrollbar': { width: '3px' },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0,0,0,0.08)',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(0,0,0,0.15)',
    },
  },
})

export const overviewIcon = style({
  height: 40,
  width: 40,
})

export const navWrapper = style({
  paddingTop: theme.spacing[1],
})

export const container = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  overflow: 'hidden',
  zIndex: theme.zIndex.belowHeader,
})

export const flyoutDialog = style({
  position: 'fixed',
  inset: 0,
  display: 'block',
  background: 'transparent',
  boxShadow: 'none',
  padding: 0,
})

export const stickyHeader = style({
  position: 'sticky',
  top: 0,
  background: 'white',
  zIndex: 2,
})
