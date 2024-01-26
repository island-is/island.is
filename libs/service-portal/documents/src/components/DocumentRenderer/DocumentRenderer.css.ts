import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const pdfControls = style({
  padding: theme.spacing[1],
  background: theme.color.white,
  alignItems: 'center',

  borderTop: 1,
  borderLeft: 1,
  borderBottom: 1,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  borderRadius: `${theme.border.radius.standard} ${theme.border.radius.standard} 0 0`,
  justifyContent: 'space-between',
  '@media': {
    [`(max-width: ${theme.breakpoints.md}px)`]: {
      justifyContent: 'center',
    },
  },
})

export const space = style({
  width: 24,
  '@media': {
    [`(max-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const pdfAction = style({})

export const pdfPage = style({
  background: theme.color.blue100,
  padding: theme.spacing[2],
  border: `1px solid ${theme.color.blue200}`,
  borderTop: 0,
})

globalStyle(`${pdfControls} button`, {
  boxShadow: 'none',
})

globalStyle(`${pdfAction} + button`, {
  '@media': {
    [`(max-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})
