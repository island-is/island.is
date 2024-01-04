import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const iconButtonContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing[1],
  borderRadius: theme.border.radius.large,
  width: '34px',
  height: '34px',
  transition: 'filter .2s',

  ':hover': {
    filter: 'brightness(0.9)',
  },
})
