import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const SIDE_MENU_WIDTH = 318

export const root = style({
  width: SIDE_MENU_WIDTH,
  padding: theme.spacing[3],
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
