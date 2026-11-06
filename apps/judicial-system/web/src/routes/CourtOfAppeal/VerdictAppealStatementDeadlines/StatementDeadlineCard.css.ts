import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

// The party on the left, the date on the right, the card's menu past it and
// the date's action under the date, laid out as the design has it: the role
// line and the name sit centred against the date picker, the menu button
// centres on the picker too, and the action hangs off the picker's right
// edge. A grid, because the text column takes whatever the picker leaves
// (so the role line stays on one line) while the picker column is sized for
// a date rather than for half the card, and the menu column for its button.
export const card = style({
  display: 'grid',
  rowGap: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(240px, 320px) auto',
      alignItems: 'center',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[1],
    },
  },
})

// On a narrow screen the menu goes first, in the top right corner of the
// card, where a card menu is looked for; the grid's own flow would have put
// it between the picker and its action. From md the menu has its own column
// and takes its place in the flow again, or it would start a row of its own
// ahead of the party.
export const menu = style({
  order: -1,
  justifySelf: 'end',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      order: 0,
      gridColumn: 3,
    },
  },
})

export const action = style({
  display: 'flex',
  justifyContent: 'flex-end',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: 2,
    },
  },
})

// The text button sets its line height to 1.6 and pads itself by 4px, which
// puts its underline a good way below the text. The design draws the line
// just under the descenders, so the action is tightened to that.
globalStyle(`${action} [role='button']`, {
  lineHeight: 1.25,
  paddingBottom: 2,
})
