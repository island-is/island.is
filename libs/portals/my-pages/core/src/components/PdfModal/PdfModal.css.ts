import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 60, 0.70)',
  zIndex: theme.zIndex.aboveModalBackdrop,
})

export const dialog = style({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.aboveModalBackdrop,
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
  width: '90vw',
  maxWidth: 900,
  height: '90vh',
  backgroundColor: theme.color.white,
  borderRadius: theme.border.radius.large,
  overflow: 'hidden',
  '@media': {
    [`(max-width: ${theme.breakpoints.md}px)`]: {
      width: '100vw',
      maxWidth: 'none',
      height: '100vh',
      margin: 0,
      borderRadius: 0,
    },
  },
})

export const toolbar = style({
  flexShrink: 0,
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
})

export const zoomLabel = style({
  minWidth: '3ch',
  textAlign: 'center',
})

export const toolbarLeft = style({
  gap: 4,
})

export const zoomButton = style({
  background: 'none',
  border: 'none',
  padding: 4,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ':disabled': {
    opacity: 0.4,
    cursor: 'default',
  },
})

export const pdfContent = style({
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})
