import { globalStyle, style } from '@vanilla-extract/css'

export const questions = style({})

/**
 * A question is a whole sentence rather than the short label a `Tag` usually
 * carries, so it is let onto more than one line instead of being held on a
 * single one and running off the side of the page.
 */
globalStyle(`${questions} button`, {
  whiteSpace: 'normal',
  height: 'auto',
  minHeight: 32,
  padding: '4px 8px',
})
