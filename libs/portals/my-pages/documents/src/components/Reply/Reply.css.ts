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

export const form = style({
  ...themeUtils.responsiveStyle({
    xs: {
      height: 'calc(100% - 286px)',
    },
    md: {
      height: 'inherit',
    },
  }),
})

export const controllerBox = style({
  ...themeUtils.responsiveStyle({
    xs: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
    },
    md: {
      display: 'block',
      height: 'inherit',
    },
  }),
})

export const modalContent = style({
  height: `calc(100vh - ${theme.spacing[2]}px)`,
  paddingBottom: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    md: {
      height: 'inherit',
      padding: '1.5rem 1rem',
    },
  }),
})

export const modalBase = style({
  width: '100%',
  height: '100%',
  background: theme.color.white,
  position: 'relative',
  top: -theme.spacing[1],
  zIndex: 100,
})
