import { globalStyle, style } from '@vanilla-extract/css'

/**
 * Wrapper for the EmptyCard each key-info section shows when it has nothing to
 * display. Figma sizes the illustration at 238x238, but core's EmptyCard caps
 * it at 105 (styles.smallImage) for the two-per-row grid it was built for, and
 * takes no size prop. Overriding it from here keeps the shared component
 * untouched; the descendant selector out-specifies the class EmptyCard sets.
 */
export const emptyCard = style({})

globalStyle(`${emptyCard} img`, {
  width: 238,
  height: 238,
  // smallImage caps the height; this has to lift it, not just set a size.
  maxHeight: 'none',
  maxWidth: '100%',
  objectFit: 'contain',
})
