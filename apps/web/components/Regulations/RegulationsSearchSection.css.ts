import { globalStyle, style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const searchInput = style({})

globalStyle(`${searchInput} div:has(> input)`, {
  paddingTop: 12,
  paddingBottom: 12,
  ...themeUtils.responsiveStyle({
    md: {
      paddingTop: 11,
      paddingBottom: 11,
    },
  }),
})

export const advancedFields = style({
  maxHeight: '40rem',
  transition: 'max-height 500ms ease-in',

  selectors: {
    '[hidden]&': {
      padding: 0,
      maxHeight: 0,
      display: 'block',
      visibility: 'hidden',
      transition: '300ms',
    },
  },
})
export const advancedFieldsTransitioning = style({
  overflow: 'hidden',
})

export const clearSearch = style({
  transition: 'opacity 300ms 200ms ease-in',

  selectors: {
    '[hidden]&': {
      display: 'block',
      opacity: 0,
      transitionDelay: '0ms',
    },
  },
})
