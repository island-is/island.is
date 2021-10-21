import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const burgerMenu = style({
  position: 'absolute',
  zIndex: 100,
  right: '0',
  top: '0',
  display: 'block',
  padding: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const burgerLines = style({
  display: 'block',
  width: theme.spacing[4],
  height: '4px',
  marginBottom: '4px',
  position: 'relative',
  backgroundColor: theme.color.blue400,
  borderRadius: '3px',
  zIndex: 1,
  transformOrigin: '4px 0px',
  transition:
    'transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease',
})

export const openBurgerLines = style({
  backgroundColor: theme.color.blueberry400,
})

export const dissapearLine = style({
  opacity: 0,
  transform: 'rotate(0deg) scale(0.2, 0.2)',
})

export const burgerMenuFirstChild = style({
  transformOrigin: '0% 0%',
})

export const openBurgerLineFirstChild = style({
  transform: 'rotate(45deg) translate(-3px, -3px)',
})

export const burgerMenuLastChilde = style({
  transformOrigin: '0% 100%',
})

export const openBurgerLineLastChild = style({
  transform: 'rotate(-45deg) translate(-1px, 0px)',
})
