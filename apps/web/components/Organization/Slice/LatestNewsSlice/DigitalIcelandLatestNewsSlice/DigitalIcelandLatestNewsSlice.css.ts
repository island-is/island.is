import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const itemContainer = style({
  borderStyle: 'solid',
  borderWidth: theme.border.width.standard,
  borderColor: theme.color.transparent,
  borderRadius: theme.border.radius.large,
  transition: 'border-color 150ms ease, opacity 150ms ease',
  padding: theme.spacing[2],
  ':hover': {
    borderColor: theme.color.blue400,
  },
})

export const itemListContainer = style({
  display: 'grid',
  gap: theme.spacing[4],
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: 'minmax(302px, 500px)',
      justifyContent: 'center',
    },
    md: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(302px, 1fr))',
    },
  }),
})
