import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const loader = style({
  display: 'inline-block',
  height: '1em',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  /*   backgroundImage:
    'linear-gradient(137.17deg, rgba(1, 97, 253, 0.2) 3.57%, rgba(63, 70, 210, 0.2) 26.83%, rgba(129, 46, 164, 0.2) 51.01%, rgba(194, 21, 120, 0.2) 75.19%, rgba(253, 0, 80, 0.2) 96.58%)', */
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
    animationDuration: '5s',
    content: '""',
    '@keyframes': {
      to: {
        transform: 'translateX(100%)',
        color: 'inherit',
      },
    },
  },
})
