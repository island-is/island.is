import { globalStyle, style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const sidebar = style({
  minWidth: '230px',
  maxWidth: '230px',
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: '318px',
      maxWidth: '318px',
    },
  }),
})

export const contentWrapper = style({
  marginTop: '0px',
  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: 'calc(100% - 318px)',
      marginTop: '-50px',
      marginLeft: '48px',
    },
    xl: {
      marginLeft: '110px',
      marginTop: '-50px',
    },
  }),
})

export const studyCardsWrapper = style({})

// Force long words in card titles to break instead of pushing card width
globalStyle(`${studyCardsWrapper} p`, {
  wordBreak: 'break-word',
})

export const truncatedText = style({
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const mobileFilterButton = style({})

globalStyle(`${mobileFilterButton} button div span`, {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
})

export const webReader = style({})

globalStyle(`${webReader} div`, {
  margin: 0,
})
