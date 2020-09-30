import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const SIDE_MENU_WIDTH = 345

export const hidden = style({
  display:'none'
})

export const titleContainer = style({
  display:'flex',
  alignItems:'left'
})
export const title = style({
  marginLeft:10,
  fontSize:18
})


export const root = style({
  /*display: 'none',*/
  left: 0,
  paddingTop: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  position: 'fixed',
  right: 0,
  top: 50,
  zIndex: 10,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      height: 'auto',
      left: 'auto',
      position: 'absolute',
      top: theme.spacing[3],
      right: theme.spacing[3],
      paddingBottom: theme.spacing[3],
      width: SIDE_MENU_WIDTH,
    },
  },
})

export const linksContent = style({
  background: theme.color.blue100,
  paddingTop: theme.spacing[4],
  paddingRight: theme.spacing[3],
  paddingBottom: theme.spacing[4],
  paddingLeft: theme.spacing[3],
  width: '100%',
})