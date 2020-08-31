import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const SIDE_MENU_WIDTH = 318

export const root = style({
  background: theme.color.white,
  display: 'none',
  height: '100%',
  padding: theme.spacing[3],
  position: 'fixed',
  right: 0,
  top: 0,
  zIndex: 1,
  boxShadow: `0px 4px 70px rgba(0, 97, 255, 0.1)`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: SIDE_MENU_WIDTH,
      position: 'absolute',
      height: 'auto',
      top: theme.spacing[3],
    },
  },
})

export const isVisible = style({
  display: 'block',
})

export const tabHeader = style({
  display: 'flex',
  paddingBottom: theme.spacing[3],
  justifyContent: 'flex-end',
})

export const tabBar = style({
  display: 'flex',
})

export const tab = style({
  padding: theme.spacing[2],
  borderBottom: `2px solid transparent`,
})
export const tabActive = style({
  borderColor: theme.color.blue400,
})

export const content = style({})

export const linksContent = style({
  background: theme.color.blue100,
  paddingTop: theme.spacing[4],
  paddingRight: theme.spacing[3],
  paddingBottom: theme.spacing[4],
  paddingLeft: theme.spacing[3],
})

export const externalLinks = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
})

export const externalLinksContent = style({
  display: 'flex',
  flexWrap: 'wrap',
})

export const mobileContent = style({})
