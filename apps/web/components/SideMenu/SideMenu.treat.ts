import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const SIDE_MENU_WIDTH = 345

export const root = style({
  visibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  left: 0,
  paddingTop: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  position: 'fixed',
  right: 0,
  top: 0,
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
  opacity: 0,
  transform: `translateY(10px)`,
  boxShadow: `0px 4px 70px rgba(0, 97, 255, 0)`,
  transition: `visibility 0s linear 300ms, opacity 150ms, transform 300ms ease-out, box-shadow 300ms ease-out`,
})

export const isVisible = style({
  visibility: 'visible',
  opacity: 1,
  transform: `translateY(0)`,
  boxShadow: `0px 4px 70px rgba(0, 97, 255, 0.1)`,
  transition: `visibility 0s linear 0s, opacity 150ms, transform 300ms ease-out, box-shadow 300ms ease-out`,
})

export const tabButton = style({
  width: '100%',
})

export const tabContainer = style({
  width: '100%',
})

export const tabBar = style({
  display: 'flex',
  width: '100%',
})

export const tab = style({
  borderBottom: '2px solid transparent',
  display: 'flex',
  minWidth: '100%',
  justifyContent: 'center',
  padding: theme.spacing[2],
})

export const tabActive = style({
  borderBottomColor: theme.color.blue400,
})

export const tabFocused = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderBottomColor: 'transparent',
    },
  },
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
