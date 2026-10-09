import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const tagList = style({})

globalStyle(`${tagList} button, ${tagList} a, ${tagList} span`, {
  maxWidth: '100%',
  minWidth: 0,
})

export const tagLabel = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flex: 1,
})

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
  alignItems: 'center',
  columnGap: theme.spacing[1],
})

export const filterOptionLabel = style({
  flex: 1,
  minWidth: 0,
})

globalStyle(`${filterOptionLabel} span`, {
  overflowWrap: 'anywhere',
})

export const filterOptionTooltip = style({
  flexShrink: 0,
  width: 16,
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
