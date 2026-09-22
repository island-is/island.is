import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

const tickSize = 8
const tickBorder = 2
const tickSelectedSize = 21
const tickSelectedBorder = 7
const trackThickness = 2

const horizontalTickArea = 32
const verticalRowHeight = 48
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

export const horizontalRow = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

export const horizontalRowSplit = style({
  display: 'grid',
})

export const horizontalTick = style({
  flexDirection: 'column',
  justifyContent: 'center',
  // Sized for the selected tick so choosing a value never re-spaces the row
  width: tickSelectedSize,
  selectors: {
    [`${horizontalRowSplit} &`]: {
      width: '100%',
    },
  },
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
