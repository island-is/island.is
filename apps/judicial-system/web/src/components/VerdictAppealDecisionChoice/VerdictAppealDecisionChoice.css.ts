import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const gridRow = style({
  display: 'grid',
  // minmax(0, 1fr) so tracks can shrink below label min-width; long
  // Icelandic labels must not blow out the BlueBox when the FormStepper
  // narrows the content column.
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gridGap: theme.spacing[2],

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
})

// Grid items default to min-width: auto, which still overflows a minmax(0, 1fr)
// track when the label is long. Zero lets them shrink with the track.
globalStyle(`${gridRow} > div`, {
  minWidth: 0,
  height: '100%',
})

// Stretch the large RadioButton label to the row height so the two options
// stay the same height when one label wraps or turns bold on selection.
globalStyle(`${gridRow} > div > label`, {
  height: '100%',
})
