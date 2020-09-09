import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const loader = style({
  display: 'inline-block',
  height: '1em',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.color.purple100,
  ':after': {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transform: 'translateX(-100%)',
    backgroundImage:
      'linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0))',
    animationIterationCount: 'infinite',
    animationDuration: '2s',
    content: '""',
    '@keyframes': {
      to: {
        transform: 'translateX(100%)',
        color: 'inherit',
      },
    },
  },
})
