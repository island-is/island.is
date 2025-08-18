import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const caseNumberDivider = style({
  ...themeUtils.responsiveStyle({
    xs: {
      position: 'relative',
      display: 'flex',
      selectors: {
        '&::before': {
          content: '',
          position: 'relative',
          top: '0.125rem',
          height: '1rem',
          width: 1,
          margin: '0 1rem',
          background: theme.color.blue200,
        },
      },
    },
    md: {
      position: 'relative',
      display: 'flex',
      selectors: {
        '&::before': {
          content: '',
          position: 'relative',
          top: '0.125rem',
          height: '1rem',
          width: 1,
          margin: '0 1rem',
          background: theme.color.blue200,
        },
      },
    },
  }),
})

export const link = style({
  paddingLeft: theme.spacing[1],
  paddingBottom: 6,
})
