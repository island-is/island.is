import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

const space = `${theme.spacing[3]}px`

export const logo = style({
  minWidth: 64,
})

export const illustration = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  padding: `0 ${space} ${space} ${space}`,
  ...themeUtils.responsiveStyle({
    md: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: '40%',
    },
  }),
})

export const svg = style({
  display: 'inline-block',
  height: 'auto',
  ...themeUtils.responsiveStyle({
    md: {
      height: 251,
    },
  }),
})

export const svgWrapper = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'auto',
  width: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      position: 'absolute',
      justifyContent: 'left',
      alignItems: 'left',
      top: 51,
      height: 251,
      width: 1000,
    },
  }),
})
