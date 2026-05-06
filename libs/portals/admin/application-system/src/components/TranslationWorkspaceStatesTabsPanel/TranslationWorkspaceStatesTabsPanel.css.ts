import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tabsPanelRoot = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  background: theme.color.white,
  paddingTop: theme.spacing[3],
  paddingBottom: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingRight: 0,
})

/**
 * The Tabs component renders several intermediate wrapper divs that break the
 * flex-column height chain. These globalStyles thread `flex: 1 / minHeight: 0`
 * through each wrapper so the scrollable content area is properly constrained.
 */
const flexColumnChild = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 0%',
  minHeight: 0,
} as const

globalStyle(`${tabsPanelRoot} > div`, flexColumnChild)

globalStyle(`${tabsPanelRoot} > div > div:last-child`, flexColumnChild)

globalStyle(
  `${tabsPanelRoot} > div > div:last-child > div:not([role="tablist"])`,
  flexColumnChild,
)

globalStyle(
  `${tabsPanelRoot} [role="tabpanel"]:not([hidden])`,
  flexColumnChild,
)

globalStyle(
  `${tabsPanelRoot} [role="tabpanel"]:not([hidden]) > div`,
  flexColumnChild,
)

globalStyle(`${tabsPanelRoot} div:has(+ [role="tablist"])`, {
  display: 'none',
})

globalStyle(
  `${tabsPanelRoot} > div > div:last-child > div:first-child:not([role])`,
  { display: 'none' },
)

globalStyle(`${tabsPanelRoot} [role="tablist"]`, {
  overflow: 'initial',
  height: `${theme.spacing[5]}px`,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
})

export const tabsPanelScroll = style({
  flex: 1,
  minHeight: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
})

export const tabsPanelInner = style({
  minWidth: 0,
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  paddingRight: theme.spacing[3],
})
