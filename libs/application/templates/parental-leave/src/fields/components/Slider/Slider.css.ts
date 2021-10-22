import { style, keyframes } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const TooltipContainer = style({
  filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.15))',
  position: 'absolute',
  bottom: '100%',
  transition: ' transform 0.3s',

  ':after': {
    content: '""',
    background: '#fff',
    width: 16,
    height: 16,
    bottom: 8,
    position: 'absolute',
    left: 0,
    transform: 'translateX(-50%) rotate(45deg)',
    zIndex: -1,
  },
})

export const TooltipBox = style({
  background: '#fff',
  padding: '3px 1em',
  display: 'inline-block',
  lineHeight: 1.5,
  fontWeight: 600,
  color: '#0061ff',
  marginBottom: 16,
  transition: 'transform 0.3s',
})

const thumbAnimation = keyframes({
  from: {
    transform: 'scale(0.6)',
  },
  to: {
    transform: 'scale(0.8)',
  },
})

export const Thumb = style({
  boxSizing: 'border-box',
  cursor: 'pointer',
  background: '#00e4ca',
  backgroundClip: 'content-box',
  padding: 20,
  width: 64,
  height: 64,
  borderRadius: '50%',
  marginLeft: -32,
  top: 'calc(100% + 2px)',
  position: 'absolute',
  transition: 'transform 0.3s',
  WebkitTapHighlightColor: 'transparent',
  outline: 'none', // TODO: temp

  ':before': {
    content: '""',
    position: 'absolute',
    left: 31,
    width: 2,
    height: 32,
    top: 0,
    background: '#00e4ca',
  },

  ':after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: '#00e4ca',
    opacity: 0.25,
    animation: `${thumbAnimation} 1.5s infinite alternate`,
  },
})

export const TrackGrid = style({
  position: 'relative',
  display: 'grid',
})

export const TrackCell = style({
  cursor: 'pointer',
})

export const remainderBar = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: -1,
  marginLeft: -1,
  height: '100%',
  pointerEvents: 'none',
  background: `repeating-linear-gradient(-45deg, #fff, #fff 5%, rgba(255, 255, 255, 0.5) 5%, rgba(255, 255, 255, 0.5) 50%, #fff 50%) top left fixed`,
  backgroundSize: '15px 15px',
  borderLeftWidth: 2,
  borderLeftStyle: 'solid',
  borderLeftColor: theme.color.white,
  transition: 'left 0.3s',
})

export const progressBar = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  marginLeft: -1,
  height: '100%',
  pointerEvents: 'none',
  transition: 'width 0.3s',
  background: theme.color.mint400,
})
