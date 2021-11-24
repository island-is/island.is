import { style } from '@vanilla-extract/css'

import { spacing } from '@island.is/island-ui/theme'

export const radioValue = style({
  marginBottom: spacing[2],

  ':last-of-type': {
    marginBottom: 0,
  },
})
