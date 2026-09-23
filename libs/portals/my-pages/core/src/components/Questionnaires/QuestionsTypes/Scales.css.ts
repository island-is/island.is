import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

const tickSize = 8
const tickBorder = 2
const tickSelectedSize = 24
const tickSelectedBorder = 8

// Each tick occupies this much regardless of state - a short row has to add it
// back when it works out its share of the full width
export const tickWidth = tickSelectedSize
const trackThickness = 2

const horizontalTickArea = 32
// Widens the tap area on split rows without touching the layout
const tapAreaBleed = 16
export const verticalRowHeight = 48
// Sized for the selected tick so choosing a value never shifts the layout
const verticalTickColumn = tickSelectedSize

export const input = style({})

export const tick = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  selectors: {
    [`${input}:disabled + &`]: {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
})

export const bubble = style({
  boxSizing: 'border-box',
  flexShrink: 0,
  width: tickSize,
  height: tickSize,
  borderRadius: '50%',
  backgroundColor: theme.color.blue100,
  border: `${tickBorder}px solid ${theme.color.blue300}`,
  transition: 'width .1s, height .1s, border .1s, box-shadow .1s',
  selectors: {
    [`${tick}:hover &`]: {
      borderColor: theme.color.blue400,
    },
    [`${input}:focus-visible + ${tick} &`]: {
      boxShadow: `0 0 0 4px ${theme.color.mint400}`,
    },
    [`${input}:disabled + ${tick}:hover &`]: {
      borderColor: theme.color.blue300,
    },
  },
})

export const bubbleSelected = style({
  width: tickSelectedSize,
  height: tickSelectedSize,
  borderWidth: tickSelectedBorder,
  borderColor: theme.color.blue400,
  selectors: {
    [`${tick}:hover &`]: {
      borderColor: theme.color.blue400,
    },
  },
})

export const bubbleError = style({
  borderColor: theme.color.red600,
  selectors: {
    [`${tick}:hover &`]: {
      borderColor: theme.color.red600,
    },
  },
})

export const track = style({
  position: 'absolute',
  backgroundColor: theme.color.blue300,
  borderRadius: theme.border.radius.lg,
})

// Runs from the low end of the scale up to the selected tick
export const trackFill = style({
  position: 'absolute',
  backgroundColor: theme.color.blue400,
  borderRadius: theme.border.radius.lg,
})

export const horizontalRow = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

export const horizontalRowSplit = style({})

export const horizontalTick = style({
  flexDirection: 'column',
  justifyContent: 'center',
  // Sized for the selected tick so choosing a value never re-spaces the row
  width: tickSelectedSize,
})

// Split rows keep the small tick but take the tap area out into the gaps
globalStyle(`${horizontalRowSplit} ${horizontalTick}::after`, {
  content: '""',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: -tapAreaBleed,
  right: -tapAreaBleed,
})

export const horizontalBubbleArea = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: horizontalTickArea,
  width: '100%',
})

export const horizontalTickText = style({
  whiteSpace: 'nowrap',
})

export const horizontalTrack = style({
  height: trackThickness,
  top: horizontalTickArea / 2 - trackThickness / 2,
  left: tickSelectedSize / 2,
  right: tickSelectedSize / 2,
})

export const horizontalTrackFill = style({
  height: trackThickness,
  top: horizontalTickArea / 2 - trackThickness / 2,
  left: tickSelectedSize / 2,
})

export const verticalMeter = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
})

export const verticalTick = style({
  height: verticalRowHeight,
})

export const verticalBubbleArea = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: verticalTickColumn,
  flexShrink: 0,
})

export const verticalTrack = style({
  width: trackThickness,
  left: verticalTickColumn / 2 - trackThickness / 2,
  top: verticalRowHeight / 2,
  bottom: verticalRowHeight / 2,
})

export const verticalTrackFill = style({
  width: trackThickness,
  left: verticalTickColumn / 2 - trackThickness / 2,
  bottom: verticalRowHeight / 2,
})

// Border + box padding + half a row, less half a line of label text: lines the
// end labels up with the center of the first and last tick
const verticalEndLabelOffset = 1 + theme.spacing[1] + verticalRowHeight / 2 - 10

export const verticalEndLabels = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  textAlign: 'right',
  width: 158,
  maxWidth: '100%',
  paddingTop: verticalEndLabelOffset,
  paddingBottom: verticalEndLabelOffset,
})
