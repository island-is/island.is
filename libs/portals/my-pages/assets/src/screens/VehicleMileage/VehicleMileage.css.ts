import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const link = style({
  color: theme.color.blue400,
  textDecoration: 'underline',
})

export const yearSelect = style({ minWidth: 160 })

export const tooltipButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 24,
  minHeight: 24,
  verticalAlign: 'middle',
  padding: 0,
  border: 0,
  borderRadius: theme.border.radius.standard,
  background: 'none',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `3px solid ${theme.color.mint400}`,
      outlineOffset: 2,
    },
  },
})
