import { spacing, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const saveDraft = style({
  selectors: {
    '&:not(:first-child)': {
      marginLeft: spacing[2],
    },
  },
})
export const deleteDraft = saveDraft
export const propose = saveDraft
