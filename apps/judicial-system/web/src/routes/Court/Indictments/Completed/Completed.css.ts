import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const motionBox = style({
  marginTop: `${theme.spacing[2]}px`,
})

export const grid = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing[2],
})
