import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const root = style({
  position: 'relative',
})

/**
 * Nothing paints until the items have been measured, so the first frame is
 * the finished pile rather than a partially laid-out one.
 */
export const measuring = style({
  visibility: 'hidden',
})

export const item = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  overflow: 'hidden',
  borderRadius: theme.border.radius.large,
  transformOrigin: 'top center',
})

/**
 * Invisible button covering the collapsed pile, so clicking anywhere on it
 * expands the items.
 */
export const expandOverlay = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  padding: 0,
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
})

export const toggle = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing[1],
})
