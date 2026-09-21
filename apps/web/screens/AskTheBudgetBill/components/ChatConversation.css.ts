import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const topBar = style({
  flexShrink: 0,
  borderBottom: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
  backgroundColor: theme.color.white,
})

export const title = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/**
 * The Zendesk widget renders its own iframe into this element and sizes itself
 * to fill it, so it needs the remaining height rather than its content height.
 */
export const widget = style({
  position: 'relative',
  flexGrow: 1,
  minHeight: 0,
})

export const loadingOverlay = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.color.white,
})

export const footer = style({
  flexShrink: 0,
})

/**
 * A conversation stretched across a desktop viewport reads badly, with the top
 * bar's ends far apart and the messages a long way from the composer, so it is
 * capped at about the width the question box has on the launcher and centred.
 */
export const conversation = style({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minHeight: 0,
  width: '100%',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
})
