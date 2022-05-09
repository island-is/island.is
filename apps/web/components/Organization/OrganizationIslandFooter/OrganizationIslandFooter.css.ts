import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const contentContainer = style({
  display: 'flex',
  ...themeUtils.responsiveStyle({
    xs: {
      flexFlow: 'column nowrap',
    },
    lg: {
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }),
})

export const globeIcon = style({
  width: '15px',
  height: '15px',
})

export const languageToggleContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '4px',
})

export const leftContent = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '20px',
})

export const rightContent = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '20px',
  ...themeUtils.responsiveStyle({
    xs: {
      paddingTop: '12px',
      alignSelf: 'flex-end',
    },
    lg: {
      alignSelf: 'inherit',
    },
  }),
})
