import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  paddingTop: '60px',
  paddingBottom: '60px',
  backgroundColor: '#2222C6',
  color: 'white',
})

export const emptyBox = style({
  width: '80px',
})

export const topRow = style({
  display: 'flex',
  gap: '20px',
  ...themeUtils.responsiveStyle({
    xs: {
      flexFlow: 'column nowrap',
    },
    sm: {
      flexFlow: 'row nowrap',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
})

export const bottomRow = style({
  display: 'flex',
  gap: '20px',
  ...themeUtils.responsiveStyle({
    xs: {
      flexFlow: 'column nowrap',
    },
    md: {
      flexFlow: 'row nowrap',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
})

export const heading = style({
  color: '#2222c6',
})
