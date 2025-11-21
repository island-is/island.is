import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const inner = style({
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  transition: 'transform 0.2s linear',
  willChange: 'transform',
})

export const vertical = style({
  width: '12px',
  height: 'auto',
})

export const options = {
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  hyphens: 'auto',
}

export const dot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'white',
  border: '2px solid transparent',
  zIndex: 10,
})

export const dotSelected = style({})

export const selectedIndicator = style({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: '#0061FF', // blue400
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 5,
  pointerEvents: 'none',
})

export const selectedIndicatorInner = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'white',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
})

export const container = style({
  width: '100%',
})

export const progressContainer = style({
  position: 'relative',
})

export const progress = style({
  height: '12px',
  position: 'relative',
  top: 0,
})

export const selectedIndicatorContainer = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '12px',
})

export const dotPosition = style({
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
})

export const textContainer = style({
  position: 'relative',
  marginTop: '4px',
})

export const textPosition = style({
  position: 'absolute',
})

export const textMiddle = style({
  transform: 'translateX(-50%)',
})

export const textFirst = style({
  width: '33.333%',
})

export const textLast = style({
  width: '33.333%',
})

export const optionsDescription = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})

globalStyle(`${textPosition} > p`, {
  paddingLeft: theme.spacing[2],
  paddingRight: theme.spacing[2],
  fontSize: 14,
})

globalStyle(`${textPosition}:not(${textLast}) > p`, {
  paddingLeft: 0,
})

globalStyle(`${textPosition}:not(${textFirst}) > p`, {
  paddingRight: 0,
})
