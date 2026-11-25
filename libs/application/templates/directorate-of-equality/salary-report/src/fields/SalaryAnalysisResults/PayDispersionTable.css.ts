import { style } from '@vanilla-extract/css'

/**
 * A bare button that inherits the header cell's own type, so the sort control
 * reads as the header it replaced rather than as a control bolted on beside it.
 *
 * Deliberately the same reset island-ui's own InteractiveTable uses for its sort
 * button (background, border, padding and font cleared): the úrbótaáætlun table
 * on this same screen IS an InteractiveTable, so the two tables would otherwise
 * offer two different-looking ways to sort. Copied rather than imported because
 * that style is a module-local vanilla-extract class, never exported from the
 * package.
 *
 * `font: inherit` and `color: inherit` are what keep the header at the smaller,
 * lighter type this table deliberately chose (see HEADER_TEXT) — a button
 * otherwise falls back to the browser's own control font.
 *
 * No layout here: display, alignment and gap come from the FocusableBox that
 * carries this class, because the right-aligned columns need their content
 * pushed to the other end and Box props express that per-column.
 *
 * island-ui's version also pins `width: 100%`, and this one deliberately does
 * not. As a block-level flex container the button already fills a header cell it
 * is the only child of, and in the ordinal cell it is NOT the only child — it
 * sits in a flex row beside the tooltip, where a 100% basis would squeeze that
 * tooltip down to nothing.
 */
export const sortButton = style({
  background: 'none',
  border: 'none',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
})
