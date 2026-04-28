import { spacing } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const userSelectionContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
})

globalStyle(`${userSelectionContainer} #checkbox-children-container`, {
  padding: 0,
  border: 'none',
})
