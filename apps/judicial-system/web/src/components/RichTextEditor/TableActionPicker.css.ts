import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

// Same panel chrome as the highlight color picker, holding icon buttons
// instead of swatches.
export const actionPicker = style({
  position: 'absolute',
  zIndex: 9999,
  background: 'white',
  border: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  padding: theme.spacing[1],
  display: 'grid',
  // Additions fill the top row; the three delete actions sit below.
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 6,
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
})

export const actionButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  border: 'none',
  borderRadius: theme.border.radius.standard,
  background: 'transparent',
  color: theme.color.dark400,
  cursor: 'pointer',
  padding: 0,
  ':hover': {
    background: theme.color.blue100,
  },
  ':focus-visible': {
    background: theme.color.mint200,
    boxShadow: `0 0 0 ${theme.border.width.large}px ${theme.color.mint400}`,
    outline: 'none',
  },
  ':active': {
    background: theme.color.blue200,
  },
})
