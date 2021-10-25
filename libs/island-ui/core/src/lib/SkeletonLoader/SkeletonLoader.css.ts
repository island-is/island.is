import { keyframes, style } from '@vanilla-extract/css'

export const loader = style({
  height: '1em',
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
    animationName: keyframes({
      to: {
        transform: 'translateX(100%)',
        color: 'inherit',
      },
    }),
  },
})
