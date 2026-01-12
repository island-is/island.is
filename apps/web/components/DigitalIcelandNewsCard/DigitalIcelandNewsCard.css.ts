import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const itemWrapper = style({
  borderStyle: 'solid',
  borderWidth: theme.border.width.standard,
  borderColor: theme.color.blue200,
  borderRadius: theme.border.radius.large,
  transition: 'border-color 150ms ease, opacity 150ms ease',
  display: 'block',
  overflow: 'hidden',
  ':hover': {
    borderColor: theme.color.blue400,
  },
})

export const itemWrapperMini = style({
  padding: theme.spacing[4],
  ...themeUtils.responsiveStyle({
    xs: {
      paddingLeft: theme.spacing[3],
      paddingRight: theme.spacing[3],
    },
    sm: {
      paddingLeft: theme.spacing[4],
      paddingRight: theme.spacing[4],
    },
  }),
})

export const contentWrapper = style({
  display: 'flex',
  justifyContent: 'space-between',

  paddingBottom: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    xs: {
      flexDirection: 'column-reverse',
    },
    sm: {
      flexDirection: 'row',
      paddingTop: theme.spacing[4],
      paddingLeft: theme.spacing[4],
      paddingRight: theme.spacing[4],
    },
  }),
})

export const contentMobile = style({
  ...themeUtils.responsiveStyle({
    xs: {
      paddingLeft: theme.spacing[2],
      paddingRight: theme.spacing[2],
    },
    sm: {
      paddingLeft: 'unset',
      paddingRight: 'unset',
    },
  }),
})

export const image = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  ...themeUtils.responsiveStyle({
    xs: {
      marginBottom: theme.spacing[2],
    },
    sm: {
      maxWidth: '200px',
      marginBottom: 'unset',
      marginLeft: theme.spacing[3],
    },
  }),
})
