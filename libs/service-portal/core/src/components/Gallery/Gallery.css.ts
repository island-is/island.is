import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { hexToRgba } from '@island.is/island-ui/utils'

export const galleryContainer = style({
  display: 'inherit',
  width: '100%',
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'flex',
      width: 'initial',
    },
  }),
})

export const gallery = style({
  contain: 'layout',
  position: 'relative',
  zIndex: theme.zIndex.base,
  aspectRatio: '1/1',
  width: '100%',

  ':focus': {
    borderColor: theme.color.mint400,
  },

  ...themeUtils.responsiveStyle({
    sm: {
      width: '352px',
      marginRight: theme.spacing[2],
    },
  }),
})

export const galleryImageWrap = style({
  position: 'relative',
  aspectRatio: '1/1',
  width: '100%',
})

export const thumbnailGrid = style({
  display: 'flex',
  marginTop: theme.spacing.p2,
  justifyContent: 'space-between',

  ...themeUtils.responsiveStyle({
    sm: {
      marginTop: 0,
      flexDirection: 'column',
    },
  }),
})

export const galleryButton = style({
  width: '20%',
  marginRight: theme.spacing[1],
  aspectRatio: '1/1',
  border: '1px solid #d2d2d2',
  borderRadius: ' 8px',
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
  zIndex: theme.zIndex.base,
  opacity: 0.8,

  ':focus': {
    borderColor: theme.color.mint400,
  },

  ...themeUtils.responsiveStyle({
    sm: {
      height: '80px',
      width: '80px',
      marginRight: 'initial',
    },
  }),
})

export const activeGalleryButton = style({
  borderColor: theme.color.blue400,
})

export const lastImageOverlay = style({
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: hexToRgba(theme.color.blue100, 1),
})
