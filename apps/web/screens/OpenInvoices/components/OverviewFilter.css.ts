import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'

// Vertical-only variants of theme.shadows.small — negative spread equal to the
// blur keeps them from bleeding out the sides of the sidebar column.
const shadowDown =
  '0 2px 4px -4px rgba(28,28,28,.1), 0 4px 4px -4px rgba(28,28,28,.2)'
const shadowUp =
  '0 -2px 4px -4px rgba(28,28,28,.1), 0 -4px 4px -4px rgba(28,28,28,.2)'

// Room beside the title and footer cards for their shadows, which the
// wrappers' overflow would otherwise clip.
const shadowSpace = 4

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: `calc(100dvh - ${STICKY_NAV_HEIGHT + theme.spacing[1]}px)`,
  paddingBottom: theme.spacing[4],
})

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  minHeight: 0,
})

// Shared by the scroll area and the footer so both reserve the same gutter and
// the two halves of the card keep a flush right edge.
const scrollbar = style({
  scrollbarGutter: 'stable',
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.color.blue200} ${theme.color.blue100}`,
  paddingRight: theme.spacing[2],
})

globalStyle(`${scrollbar}::-webkit-scrollbar`, {
  width: 8,
})
globalStyle(`${scrollbar}::-webkit-scrollbar-track`, {
  background: theme.color.blue100,
})
globalStyle(`${scrollbar}::-webkit-scrollbar-thumb`, {
  background: theme.color.blue200,
  borderRadius: 4,
})

// The overlap strip is transparent, so clicks pass through to the scroll area.
const shadowWrapper = style({
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
  pointerEvents: 'none',
})

globalStyle(`${shadowWrapper} > *`, {
  pointerEvents: 'auto',
})

export const title = style([
  scrollbar,
  shadowWrapper,
  {
    flex: 'none',
    paddingBottom: shadowSpace,
    marginBottom: -shadowSpace,
  },
])

export const titleShadow = style({
  boxShadow: shadowDown,
})

// min-height:0 is required — without it the flex child refuses to shrink and
// never scrolls. isolation keeps z-indexed DatePicker parts below the title
// shadow.
export const scrollArea = style([
  scrollbar,
  {
    flex: '1 1 auto',
    minHeight: 0,
    isolation: 'isolate',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollPaddingBlock: 3,
  },
])

export const cardTop = style({
  background: theme.color.white,
  borderTopLeftRadius: theme.border.radius.large,
  borderTopRightRadius: theme.border.radius.large,
})

export const footer = style([
  scrollbar,
  shadowWrapper,
  {
    flex: 'none',
    paddingTop: shadowSpace,
    marginTop: -shadowSpace,
  },
])

export const footerCard = style({
  background: theme.color.white,
  borderBottomLeftRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,
  transition: 'box-shadow 150ms ease',
})

export const footerCardShadow = style({
  boxShadow: shadowUp,
})
