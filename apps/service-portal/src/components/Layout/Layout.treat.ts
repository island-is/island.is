import { style } from 'treat'

export const mainWrapper = style({
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
})

export const mainContainer = style({
  width: '100%',
  margin: '0 auto',
  paddingRight: '366px',
  '@media': {
    '(max-width: 1700px)': {
      paddingRight: '0px',
    },
  },
})

export const messages = style({
  height: '100vh',
  maxWidth: '366px',
  width: '100%',
  borderLeft: '1px solid #F2F2F5',
  position: 'absolute',
  right: '-366px',
  backgroundColor: 'red',
  top: '0',
  transition: 'right 2s ease',
})
