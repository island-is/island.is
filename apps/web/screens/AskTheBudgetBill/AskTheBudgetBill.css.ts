import { keyframes, style, styleVariants } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

/**
 * Fills what is left of the viewport below the site header. The height is
 * measured on the client, since alert banners and the collapsed mobile header
 * move the top edge, so this is only the value used before hydration.
 */
export const shell = style({
  position: 'relative',
  overflow: 'hidden',
  // The main landmark is a flex row, and this only holds absolutely positioned
  // layers, so it has no width of its own to grow from.
  width: '100%',
  flexGrow: 1,
  height: `calc(100vh - ${theme.headerHeight.large}px)`,
  minHeight: '520px',
})

/**
 * The widget is rendered once and kept at full size for the lifetime of the
 * page, since a second `render` call would tear down the conversation in
 * progress. The launcher is layered on top of it rather than replacing it.
 */
export const layer = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  transition: 'opacity 200ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const layerVisibility = styleVariants({
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
  },
})

export const launcherLayer = style({
  overflowY: 'auto',
  background: `linear-gradient(180deg, ${theme.color.blue100} 0%, ${theme.color.white} 55%)`,
})

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
})

/**
 * Auto margins rather than `justify-content`, so that content taller than the
 * viewport still scrolls from its top edge instead of being clipped.
 */
export const launcherInner = style({
  animation: `${fadeIn} 320ms ease both`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
})
