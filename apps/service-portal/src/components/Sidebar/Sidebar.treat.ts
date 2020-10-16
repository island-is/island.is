import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const sidebar = style({
  minWidth: 250,
  height: '100%',
  marginBottom: theme.spacing['10'],
  ...themeUtils.responsiveStyle({
    xl: {
      width: 300,
    },
  }),
})

export const subNavBlue = style({
  borderLeft: `1px solid ${theme.color.blue200}`,
})

export const subNavPurple = style({
  borderLeft: `1px solid ${theme.color.blueberry200}`,
})
