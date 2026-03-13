import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const organizationLogo = style({
  position: 'relative',
  width: theme.spacing[4],
  height: theme.spacing[4],
})

export const organizationColumn = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      display: 'table-cell',
    },
  }),
})

export const heading = style({
  fontSize: 32,
  paddingTop: 16,
})

export const description = style({
  fontSize: 18,
  maxWidth: 774,
})
