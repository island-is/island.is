import { theme } from '@island.is/island-ui/theme'
import { createVar, globalStyle, style } from '@vanilla-extract/css'

export const wrap = style({
  marginBottom: -theme.spacing[1],
})

export const breadIcon = style({
  position: 'relative',
  display: 'inline-block',
  top: '3px',
})

export const lock = style({
  position: 'absolute',
  margin: 'auto',
  right: 20,
  top: 0,
  bottom: 0,
})

const mobileNavEase = '300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
// Matches the GridContainer gutter
const mobileNavGutter = createVar()

// Always full width; the floating card is a clip-path, so sticking animates
// paint only — no layout shift and the content inside never moves.
export const mobileNav = style({
  vars: { [mobileNavGutter]: `${theme.spacing[2]}px` },
  position: 'sticky',
  top: 0,
  zIndex: 99,
  paddingInline: mobileNavGutter,
  backgroundColor: theme.color.blue100,
  borderTop: `1px solid ${theme.color.transparent}`,
  clipPath: `inset(0 ${mobileNavGutter} round ${theme.border.radius.large})`,
  transition: `top ${mobileNavEase}, clip-path ${mobileNavEase}, border-color ${mobileNavEase}`,
  willChange: 'top, clip-path',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      vars: { [mobileNavGutter]: `${theme.spacing[3]}px` },
    },
  },
})

export const mobileNavStuck = style({
  borderTopColor: theme.color.blue200,
  clipPath: 'inset(0 0 round 0)',
})

// Gap above the floating card. It scrolls out from under the header at the
// exact moment the menu sticks, which is what flips the stuck state.
export const mobileNavSentinel = style({
  paddingBottom: theme.spacing[2],
})

// Keeps the back link pinned while the menu scrolls beneath it. The opaque
// background is load-bearing — without it the menu shows through.
export const stickyGoBack = style({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  background: theme.color.white,
  paddingTop: 3,
})

// Vertical-only variants of theme.shadows.small — negative spread equal to the
// blur keeps them from bleeding out the sides of the sidebar column.
const shadowDown =
  '0 2px 4px -4px rgba(28,28,28,.1), 0 4px 4px -4px rgba(28,28,28,.2)'
const shadowUp =
  '0 -2px 4px -4px rgba(28,28,28,.1), 0 -4px 4px -4px rgba(28,28,28,.2)'

export const stickyGoBackShadow = style({
  boxShadow: shadowDown,
})

// The menu scrolls on its own below the back link. min-height:0 is required —
// without it the flex child refuses to shrink and never scrolls.
export const scrollArea = style({
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  scrollPaddingBlock: 3,
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.color.blue200} ${theme.color.blue100}`,
})

globalStyle(`${scrollArea}::-webkit-scrollbar`, {
  width: 8,
})
globalStyle(`${scrollArea}::-webkit-scrollbar-track`, {
  background: theme.color.blue100,
})
globalStyle(`${scrollArea}::-webkit-scrollbar-thumb`, {
  background: theme.color.blue200,
  borderRadius: 4,
})

// Focus-ring clearance for the menu links now that the scroll container has no
// inline padding. Same blue as the menu, so it reads as one box.
export const navGutter = style({
  paddingInline: 3,
})

// Zero-height overlay pinned to the bottom of the scroll area. An inset shadow
// would paint below the opaque nav box; this paints above it.
export const scrollShadowBottom = style({
  position: 'sticky',
  bottom: 0,
  height: 0,
  zIndex: 1,
  pointerEvents: 'none',
  opacity: 0,
  boxShadow: shadowUp,
  transition: 'opacity 150ms ease',
})

export const scrollShadowVisible = style({
  opacity: 1,
})

export const fullWidthInner = style({
  maxWidth: theme.breakpoints.xl,
})

export const fullWidthMinHeight = style({
  // Fallback for browsers without dvh
  minHeight: `calc(100vh - ${theme.headerHeight.large}px)`,
  // Mobile browser chrome (address bar) resizes the visual viewport as the
  // user scrolls, which makes a static 100vh cut off or leave a gap at the
  // bottom of full-bleed views (Dashboard, Search, Finance, Documents).
  '@supports': {
    '(height: 100dvh)': {
      minHeight: `calc(100dvh - ${theme.headerHeight.large}px)`,
    },
  },
})

export const fullWidthSplit = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      background:
        'linear-gradient( to right, white 0%, white 45%, #fbfbfc 45%, #fbfbfc 100% );',
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      background:
        'linear-gradient( to right, white 0%, white 45.5%, #fbfbfc 45%, #fbfbfc 100% );',
    },
    [`screen and (min-width: 2000px)`]: {
      background:
        'linear-gradient( to right, white 0%, white 46%, #fbfbfc 45%, #fbfbfc 100% );',
    },
    [`screen and (min-width: 2600px)`]: {
      background:
        'linear-gradient( to right, white 0%, white 47.5%, #fbfbfc 45%, #fbfbfc 100% );',
    },
  },
})
