import { style, globalStyle } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const appendix = style({
  position: 'relative',
  display: 'flex',
  flexFlow: 'column',
})

export const appendixTools = style({
  order: -1,
  display: 'flex',
  marginLeft: 'auto',
  marginBottom: theme.spacing[2],

  ...themeUtils.responsiveStyle({
    sm: {
      position: 'absolute',
      bottom: '100%',
      right: theme.spacing[8],
      paddingBottom: theme.spacing[1],
    },
  }),
})

globalStyle(`${appendixTools} > *`, {
  marginLeft: theme.spacing[2],
})
