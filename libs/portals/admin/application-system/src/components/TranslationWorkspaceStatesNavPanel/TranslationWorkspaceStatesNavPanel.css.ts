import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const statesNavPanelRoot = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  background: theme.color.white,
  paddingTop: theme.spacing[3],
  paddingBottom: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingRight: 0,
})

export const statesNavPanelScroll = style({
  flex: 1,
  minHeight: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
})

export const statesNavPanelInner = style({
  minWidth: 0,
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  paddingRight: theme.spacing[3],
})
