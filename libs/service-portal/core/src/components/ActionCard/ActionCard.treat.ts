import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  transition: 'border-color 200ms',
  ':hover': {
    borderColor: theme.color.blue300,
  },
})

// The line on text buttons overflows it's element,
// resulting in uneven alignment
export const buttonWrapper = style({
  paddingBottom: 2,
})
