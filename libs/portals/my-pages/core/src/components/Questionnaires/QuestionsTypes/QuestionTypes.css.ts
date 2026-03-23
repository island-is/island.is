import { theme } from '@island.is/island-ui/theme'
import { keyframes, style } from '@vanilla-extract/css'
export const scaleContainer = style({})

export const scaleButton = style({
  borderRight: '1px solid',
  borderTop: '1px solid',
  borderBottom: '1px solid',
  borderColor: theme.color.blue200,
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue400,
      fontWeight: 500,
      color: `${theme.color.white} !important`,
      border: '1px solid',
      cursor: 'pointer',
      borderColor: theme.color.blue400,
    },
    '&:first-of-type': {
      borderTopLeftRadius: theme.border.radius.standard,
      borderBottomLeftRadius: theme.border.radius.standard,
      borderLeft: '1px solid',
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: theme.color.blue200,
    },
    '&:last-of-type': {
      borderTopRightRadius: theme.border.radius.standard,
      borderBottomRightRadius: theme.border.radius.standard,
    },
  },
})

export const scaleButtonSelected = style({
  border: '1px solid',
  borderColor: theme.color.blue400,
  fontWeight: 500,
  backgroundColor: theme.color.blue400,
  color: theme.color.white,
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue400,
      border: '1px solid',
      cursor: 'pointer',
      color: theme.color.white,
      borderColor: theme.color.blue400,
    },
  },
})

export const outerSlider = style({
  height: 16,
  padding: 4,
})

export const thermoMeterDraggerContainer = style({
  boxSizing: 'border-box',
  background: theme.color.mint400,
  backgroundClip: 'content-box',
  padding: theme.spacing[2] + theme.spacing.smallGutter,
  width: theme.spacing[8],
  height: theme.spacing[8],
  borderRadius: '50%',
  position: 'absolute',
  left: theme.spacing[1],
  transform: 'translateY(-50%)',
  WebkitTapHighlightColor: 'transparent',
  outline: 'none',
  touchAction: 'none',
  zIndex: 10,
})

export const dragAnimation = keyframes({
  from: {
    transform: 'scale(0.6)',
  },
  to: {
    transform: 'scale(0.8)',
  },
})

export const thermoMeterDragger = style({
  content: '""',
  position: 'absolute',
  left: '0px',
  top: '0px',
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: theme.color.mint400,
  opacity: 0.25,
  transition: 'transform 1.5s ease-in-out',
  pointerEvents: 'none',
  animation: `${dragAnimation} 1.5s infinite alternate`,
})

export const thermoMeterDragLine = style({
  position: 'absolute',
  left: '-18px',
  width: '51px',
  height: '2px',
  backgroundColor: theme.color.mint400,
  transform: 'translateY(-1px)',
  zIndex: 5,
  transition: 'none',
})
export const thermoMeterDragLineActive = style({
  transition: 'transform 0.3s, top 0.2s ease',
})

export const thermoMeterThumbContainer = style({
  position: 'relative',
  width: '60px',
})

export const thermoMeterContainer = style({
  width: '80px',
  userSelect: 'none',
  overflow: 'hidden',
})

export const thermoMeterSegment = style({
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease',
})
