import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const gridContainer = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '65fr 35fr',
    },
  }),
})

export const gridContainerSubpage = style({
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
    },
  }),
})

export const gridContainerWidth = style({
  maxWidth: '1342px',
  margin: '0 auto',
})

export const textContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  ...themeUtils.responsiveStyle({
    xs: {
      order: 1,
      paddingTop: '32px',
      paddingBottom: '20px',
    },
    lg: {
      order: 0,
      display: 'grid',
      placeItems: 'left',
      textAlign: 'left',
      paddingTop: '0px',
    },
  }),
})

export const textContainerNoTitle = style({
  order: 0,
})

export const textContainerSubpage = style({
  minHeight: '20px',
})

export const textInnerContainer = style({
  ...themeUtils.responsiveStyle({
    lg: {
      height: '100%',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingBottom: '105px',
      justifyContent: 'center',
    },
  }),
})

export const textInnerContainerSubpage = style({
  ...themeUtils.responsiveStyle({
    lg: {
      paddingLeft: '288px',
      paddingBottom: '0',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    xs: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
})

export const headerImage = style({
  width: '100%',
  order: 1,
  ...themeUtils.responsiveStyle({
    xs: {
      maxHeight: '200px',
    },
    lg: {
      maxHeight: '100%',
    },
  }),
})

export const title = style({
  zIndex: 0,
})
