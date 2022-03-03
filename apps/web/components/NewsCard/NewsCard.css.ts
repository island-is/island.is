import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const image = style({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  marginLeft: theme.spacing[7],
  maxWidth: 200,
})

export const mini = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  marginLeft: -24,
  marginRight: -24,
  ...themeUtils.responsiveStyle({
    md: {
      borderLeft: `1px solid ${theme.color.blue200}`,
      borderBottom: 'none',
      marginLeft: 0,
      marginRight: 0,
    },
  }),
})
