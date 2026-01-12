import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { theme } from '@island.is/island-ui/theme'

export const button = recipe({
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `12px ${theme.spacing[2]}px`,
    border: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
    borderRadius: theme.border.radius.large,
    fontSize: 14,

    selectors: {
      '&:hover': {
        backgroundColor: theme.color.blue100,
      },
    },
  },
  variants: {
    state: {
      default: {
        background: theme.color.white,
        fontWeight: 400,
      },
      selected: {
        background: theme.color.blue100,
        fontWeight: 600,
      },
    },
  },
  defaultVariants: {
    state: 'default',
  },
})
