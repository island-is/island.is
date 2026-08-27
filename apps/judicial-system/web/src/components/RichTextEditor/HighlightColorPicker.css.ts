import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const colorPicker = style({
  position: 'absolute',
  zIndex: 9999,
  background: 'white',
  border: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  padding: theme.spacing[1],
  display: 'grid',
  // Word's 15 highlight colors plus the ✕ button fill a 4x4 grid exactly.
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 6,
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
})

export const colorSwatch = style({
  width: 24,
  height: 24,
  border: `${theme.border.width.standard}px solid rgba(0,0,0,0.12)`,
  borderRadius: theme.border.radius.standard,
  cursor: 'pointer',
  padding: 0,
  ':hover': {
    border: `${theme.border.width.large}px solid ${theme.color.blue300}`,
  },
})

export const colorSwatchSelected = style({
  border: `${theme.border.width.large}px solid ${theme.color.blue300}`,
})

export const removeColor = style({
  width: 24,
  height: 24,
  border: `${theme.border.width.standard}px solid rgba(0,0,0,0.12)`,
  borderRadius: theme.border.radius.standard,
  cursor: 'pointer',
  background: 'transparent',
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.color.dark400,
  ':hover': {
    background: theme.color.blue100,
  },
})
