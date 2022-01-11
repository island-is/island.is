import { spacing, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const downloadDraftButton = style({
  selectors: {
    '&:not(:first-child)': {
      marginLeft: spacing[2],
      borderLeft: `1px solid ${theme.color.dark200}`,
      paddingLeft: spacing[2],
    },
  },
})
