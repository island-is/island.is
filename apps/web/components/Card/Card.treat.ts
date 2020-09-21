import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  boxSizing: 'border-box',
  minHeight: 146,
  textDecoration: 'none',
  position: 'relative',
  ':hover': {
    borderColor: theme.color.purple400,
    textDecoration: 'none',
  },
})

export const cardContent = style({
  display: 'inline-block',
  position: 'relative',
})

export const cardContentNarrower = style({
  width: '66%',
})

export const imageContainer = style({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '33%',
  top: 0,
  bottom: 0,
  right: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center right',
  backgroundRepeat: 'no-repeat',
  ':after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 10%, rgba(255,255,255,0) 100%)`,
  },
})

export const imageContainerStacked = style({
  width: '100%',
  height: '50%',
  top: 'initial',
  opacity: 0.25,
  left: 0,
  ':after': {
    background: `radial-gradient(at bottom right, rgba(255,255,255,0) 30%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,1) 100%)`,
  },
})
