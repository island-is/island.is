import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const SIDE_MENU_WIDTH = 345

export const root = style({
  visibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  left: theme.spacing[3],
  paddingTop: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  position: 'fixed',
  right: theme.spacing[3],
  top: theme.spacing[3],
  zIndex: 10,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      left: 'auto',
      height: 'auto',
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

export const contentScrollWrapper = style({
  flex: 1,
  minHeight: 0, // for Firefox
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      overflowY: 'scroll',
      overflowX: 'hidden', // prevent horizontal scrolling in mobile
    },
  },
})

export const isVisible = style({
  visibility: 'visible',
  opacity: 1,
  transform: `translateY(0)`,
  boxShadow: `0px 4px 70px rgba(0, 97, 255, 0.1)`,
  transition: `visibility 0s linear 0s, opacity 150ms, transform 300ms ease-out, box-shadow 300ms ease-out`,
})

export const tabContainer = style({
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  borderBottom: '2px solid transparent',
})

export const tabBorder = style({
  position: 'relative',
  '::before': {
    content: "''",
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    right: 0,
    background: theme.color.blue400,
    height: 2,
  },
})

export const tabBar = style({
  display: 'flex',
})

export const tab = style({
  borderBottom: '2px solid transparent',
  display: 'flex',
  minWidth: '100%',
  justifyContent: 'center',
  padding: theme.spacing[2],
})

export const tabButton = style({
  width: '100%',
  // accommodate for button border that otherwise overflows
  marginTop: 3,
  marginLeft: 3,
  marginRight: 3,
})

export const content = style({
  paddingBottom: theme.spacing[2],
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

export const closeButton = style({
  position: 'absolute',
  right: theme.spacing[3],
  top: theme.spacing[3],
})
