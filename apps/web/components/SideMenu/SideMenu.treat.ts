import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const SIDE_MENU_WIDTH = 345

export const root = style({
  display: 'none',
  left: 0,
  paddingTop: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  position: 'fixed',
  right: 0,
  top: 0,
  zIndex: 1,
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

export const isVisible = style({
  display: 'flex',
  flexDirection: 'column',
})

export const tabBar = style({
  display: 'flex',
})

export const tab = style({
  borderBottom: `2px solid transparent`,
  flex: 1,
  padding: theme.spacing[2],
})
export const tabActive = style({
  borderColor: theme.color.blue400,
})

export const content = style({
  flex: 1,
  overflow: 'auto',
  paddingBottom: theme.spacing[2],
  // for Firefox
  minHeight: 0,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingBottom: 0,
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

export const mobileContent = style({})
