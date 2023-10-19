import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const image = style({
  objectFit: 'cover',
  width: '100%',
  height: 200,
})

export const container = style({
  ':focus': {
    backgroundColor: theme.color.transparent,
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
})
