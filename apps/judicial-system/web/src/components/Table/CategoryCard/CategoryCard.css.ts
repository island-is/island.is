import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  padding: `${theme.spacing[2]}px`,
  textAlign: 'left',
  backgroundColor: theme.color.white,
  borderRadius: theme.border.radius.large,
  borderColor: theme.border.color.blue200,
  borderWidth: theme.border.width.standard,
  ':focus': {
    borderColor: theme.border.color.mint400,
    borderWidth: theme.border.width.large,
  },
  ':hover': {
    borderColor: theme.color.blue400,
  },
})
