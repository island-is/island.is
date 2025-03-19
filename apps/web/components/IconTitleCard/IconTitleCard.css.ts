import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

const IMG_CONTAINER_WIDTH = 88
const IMG_CONTAINER_WIDTH_SMALL = 68

export const container = style({
  height: 80,
  minWidth: 0,
  minHeight: 0,
})

export const iconContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: theme.spacing[2],
  paddingRight: theme.spacing[2],
  width: IMG_CONTAINER_WIDTH_SMALL,
  ...themeUtils.responsiveStyle({
    md: {
      paddingLeft: theme.spacing[3],
      paddingRight: theme.spacing[3],
      width: IMG_CONTAINER_WIDTH,
    },
  }),
})

export const icon = style({
  objectFit: 'cover',
  width: '100%',
  height: 'auto',
  maxWidth: 65,
  maxHeight: 65,
})
