import { style } from '@vanilla-extract/css'

export const columnStyle = style({
  paddingTop: '0px',
  paddingBottom: '0px',
  '@media': {
    'screen and (min-width: 576px)': {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
    },
  },
})

export const starterColumnStyle = style({
  paddingTop: '1.5rem',
  paddingBottom: '1rem',
})

export const sectionColumn = style({
  '@media': {
    print: {
      flexBasis: '50%',
      maxWidth: '50%',
    },
  },
})
