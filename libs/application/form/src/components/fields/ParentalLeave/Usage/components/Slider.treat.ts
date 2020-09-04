import { style } from 'treat'
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
  top: '100%',
  position: 'absolute',
  transition: 'transform 0.3s',
  WebkitTapHighlightColor: 'transparent',

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
    '@keyframes': {
      from: {
        transform: 'scale(0.6)',
      },
      to: {
        transform: 'scale(0.8)',
      },
    },
    animation: '@keyframes 1.5s infinite alternate',
  },
})

export const TrackGrid = style({
  display: 'grid',
  gridTemplateRows: 40,
  gridGap: 2,
  position: 'relative',
  margin: '64px 10px',
})

export const TrackCell = style({
  // background: ${({ isShared }) => (isShared ? '#00E4CA' : '#0061FF')};
  // opacity: ${({ isActive }) => (isActive ? 1 : 0.3)};
})
