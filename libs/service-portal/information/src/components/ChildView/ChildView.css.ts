import { globalStyle, style } from '@vanilla-extract/css'

export const pageWrapper = style({
  '@media': {
    print: {
      //So the data doesn't clip into the logo
      position: 'absolute',
      top: '40px',
      margin: 0,
    },
  },
})

globalStyle(`${pageWrapper} ul > li:first-of-type`, {
  '@media': {
    print: {
      //the eyebrow title thing clips because of the negative margin, but this margin overrides that that
      marginTop: '25px',
      paddingBottom: '5px',
    },
  },
})

globalStyle(`${pageWrapper} div, ${pageWrapper} li`, {
  '@media': {
    print: {
      //reset
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
  },
})
