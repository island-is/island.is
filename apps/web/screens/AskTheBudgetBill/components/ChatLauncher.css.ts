import { style } from '@vanilla-extract/css'

/** Capped at the width the conversation itself has, so that the question box
 * does not move or change size when the chat opens on top of it. */
export const content = style({
  width: '100%',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
})
