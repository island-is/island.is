import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

/**
 * Compact-header collapse widths. The header is full viewport width, so these
 * match both `@container adminbar` (in-header controls) and `@media` /
 * matchMedia (overflow menu items — Reakit portals the menu to `document.body`,
 * so container queries would never match).
 *
 * - 1140: overflow ("more") appears; IS/EN tabs hide
 * - 1000: Save / Publish move into the overflow menu
 * - 758: history button moves into the overflow menu
 * - 600: autosave indicator hides
 */
export const overflowMenuMaxPx = 1140
export const compactActionsMaxPx = 1000
export const historyCompactMaxPx = 758
export const autosaveHideMaxPx = 600

export const srOnly = style({
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
})

export const back = style({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg - 1}px)`]: {
      order: 1,
    },
  },
})

/** Show the labelled back control from typical laptop width and up. */
const laptopMin = 1280

export const backWide = style({
  display: 'none',
  '@container': {
    [`adminbar (min-width: ${laptopMin}px)`]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
})

export const backCompact = style({
  display: 'flex',
  alignItems: 'center',
  '@container': {
    [`adminbar (min-width: ${laptopMin}px)`]: {
      display: 'none',
    },
  },
})

globalStyle(`${backCompact}::before, ${backCompact}::after`, {
  content: '',
  width: 1,
  height: 32,
  backgroundColor: theme.color.blue200,
  margin: '0 8px',
  flexShrink: 0,
  display: 'none',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg - 1}px)`]: {
      display: 'block',
    },
  },
})

globalStyle(`${backCompact} > button`, {
  width: 32,
  height: 32,
  backgroundColor: theme.color.blue200,
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
})

globalStyle(`${backCompact} > button svg`, {
  marginLeft: 0,
  marginRight: 0,
})

export const autosave = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  '@container': {
    [`adminbar (max-width: ${autosaveHideMaxPx}px)`]: {
      display: 'none',
    },
  },
})

export const autosaveLabel = style({
  '@container': {
    [`adminbar (max-width: ${overflowMenuMaxPx}px)`]: {
      display: 'none',
    },
  },
})

export const autosaveTime = style({
  '@container': {
    [`adminbar (max-width: ${historyCompactMaxPx}px)`]: {
      display: 'none',
    },
    [`adminbar (max-width: ${autosaveHideMaxPx}px)`]: {
      display: 'inline',
    },
  },
})

/** Language toggle; hidden when the overflow menu takes over. */
export const locale = style({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  '@container': {
    [`adminbar (max-width: ${overflowMenuMaxPx}px)`]: {
      display: 'none',
    },
  },
})

export const history = style({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  '@container': {
    [`adminbar (max-width: ${historyCompactMaxPx}px)`]: {
      display: 'none',
    },
  },
})

export const save = style({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  '@container': {
    [`adminbar (max-width: ${compactActionsMaxPx}px)`]: {
      display: 'none',
    },
  },
})

export const publish = style({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  '@container': {
    [`adminbar (max-width: ${compactActionsMaxPx}px)`]: {
      display: 'none',
    },
  },
})

export const overflow = style({
  display: 'none',
  '@container': {
    [`adminbar (max-width: ${overflowMenuMaxPx}px)`]: {
      display: 'flex',
      alignItems: 'center',
      flex: '0 0 auto',
    },
  },
})

const iconSquareButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  ...themeUtils.responsiveStyle({
    md: {
      width: 48,
      height: 48,
    },
  }),
} as const

/** Square ghost icon/label buttons, same height as the small header actions. */
globalStyle(
  `${locale} > button, ${history} > button, ${overflow} > button`,
  iconSquareButton,
)

globalStyle(
  `${locale} > button svg, ${history} > button svg, ${overflow} > button svg`,
  {
    marginLeft: 0,
    marginRight: 0,
  },
)

export const trailActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flex: '0 0 auto',
})
