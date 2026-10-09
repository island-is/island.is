import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const scrollList = style({
  maxHeight: 200,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingTop: theme.spacing[2],
  paddingRight: theme.spacing[2],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
})

export const filterOption = style({
  display: 'flex',
  alignItems: 'flex-start',
  columnGap: theme.spacing[1],
})

export const filterOptionLabel = style({
  flex: 1,
  minWidth: 0,
})

globalStyle(`${filterOptionLabel} span`, {
  overflowWrap: 'anywhere',
})

// island-ui's Checkbox centres the box against the whole label; top-align it
// so a wrapped label keeps its box beside the first line.
globalStyle(`${filterOptionLabel} label`, {
  alignItems: 'flex-start',
})

globalStyle(`${filterOptionLabel} label > div:first-child`, {
  alignSelf: 'flex-start',
})

// Height matches the checkbox so the icon centres on the label's first line.
export const filterOptionTooltip = style({
  flexShrink: 0,
  width: 16,
  height: theme.spacing[3],
  display: 'flex',
  alignItems: 'center',
})

// Zero-height marker element observed by the infinite-scroll
// IntersectionObserver — it becomes visible just before the user reaches
// the bottom of the scrollable list.
export const sentinel = style({
  height: 1,
})

export const loadingMoreRow = style({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
})
