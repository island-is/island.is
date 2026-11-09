import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const pricingRows = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
})

export const readOnlyInput = style({
  background: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 64,
  padding: '10px 16px',
})

export const totalBox = style({
  background: '#F2F7FF',
  borderRadius: 8,
  padding: 16,
})
