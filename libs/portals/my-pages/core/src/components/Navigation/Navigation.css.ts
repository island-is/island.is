import { style, styleVariants, keyframes } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import { StyleWithSelectors } from '@vanilla-extract/css/dist/declarations/src/types'

export const divider = style({
  width: '100%',
  height: 1,
})

export const largerClickableArea = style({
  ':after': {
    position: 'absolute',
    display: 'inline-block',
    cursor: 'pointer',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    content: '""',
    margin: -10,
  },
})

export const root = style({
  transition: 'background-color 150ms',
})

export const ul = style({
  borderLeftWidth: 1,
  borderLeftStyle: 'solid',
  borderLeftColor: theme.color.transparent,
})

export const colorScheme = styleVariants({
  blue: {},
  purple: {},
  darkBlue: {},
})

export const text = style({
  position: 'relative',
})

export const textNarrower = style({
  width: 'calc(100% - 34px)',
})

export const link = style({
  position: 'relative',
  ':hover': {
    textDecoration: 'none',
    cursor: 'pointer',
  },
})

export const level = styleVariants({
  1: {
    padding: 0,
  },
  2: {
    marginTop: theme.spacing[1],
    marginBottom: theme.spacing[1],
    marginLeft: theme.spacing[3],
    marginRight: theme.spacing[3],
  },
})

export const menuBtn = style({
  width: '100%',
  cursor: 'pointer',
  outline: 'none',
  borderRadius: 8,
  padding: `${theme.spacing['p2']}px ${theme.spacing[2]}px`,
  transition:
    'box-shadow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  willChange: 'transform, box-shadow',
  ':focus-visible': {
    boxShadow: `0 0 0 3px ${theme.color.blue400}`,
  },
  ':active': {
    transform: 'scale(0.98)', // Subtle press feedback
  },
})

export const listItem = style({
  position: 'relative',
})

export const itemLevel = styleVariants({
  1: {},
  2: {
    paddingBottom: theme.spacing['smallGutter'],
    paddingTop: theme.spacing['smallGutter'],
  },
})

const translate = 'translateX(-50%) translateY(-50%)'

export const icon = style({
  position: 'absolute',
  left: '50%',
  top: '50%',
  opacity: 1,
  transform: `${translate} rotateZ(0deg)`,
  transition: 'opacity 150ms ease, transform 300ms ease',
})

export const iconRemoveHidden = style({
  opacity: 0,
  transform: `${translate} rotateZ(-90deg)`,
})

export const iconRemoveVisible = style({
  opacity: 1,
  transform: `${translate} rotateZ(0deg)`,
})

export const iconAddHidden = style({
  opacity: 0,
  transform: `${translate} rotateZ(0deg)`,
})

export const iconAddVisible = style({
  opacity: 1,
  transform: `${translate} rotateZ(-0deg)`,
})

export const rotated = style({
  transition: 'transform 300ms ease',
})

export const accordionIcon = style({
  position: 'absolute',
  display: 'inline-block',
  lineHeight: 0,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  top: 10,
  right: 0,
  width: 24,
  height: 24,
  outline: 0,
})

export const dropdownIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 40,
  width: 40,
  borderRadius: '50%',
})

export const menuShadow = styleVariants({
  blue: {
    boxShadow: ' 0px 4px 30px rgba(0, 97, 255, 0.25)',
  },
  purple: {
    boxShadow: ' 0px 4px 30px rgba(106, 46, 160, 0.25)',
  },
  darkBlue: {
    boxShadow: ' 0px 4px 30px rgba(0, 0, 60, 0.25)',
  },
})

export const transition = style({
  opacity: 0,
  transition: 'opacity 150ms ease-in-out',
  selectors: {
    '&[data-enter]': {
      opacity: 1,
    },
  },
})

export const scrolledMenu = style({
  position: 'relative',
  marginLeft: 0,
  marginRight: 0,
  transition:
    'margin-left 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94), margin-right 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-radius 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
})

export const scrolledMenuVisible = style({
  borderRadius: 'unset',
  marginLeft: -theme.spacing[2],
  marginRight: -theme.spacing[2],
  transition:
    'margin-left 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94), margin-right 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-radius 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
})

export const mobileNav = style({
  zIndex: 1500,
  opacity: 1,
  backgroundColor: theme.color.blue100,
  height: '100%',
})

export const shakeKeyframe = keyframes({
  from: {
    transform: 'translateX(0)',
  },
  '25%': {
    transform: 'translateX(-1px)',
  },
  '45%': {
    transform: 'translateX(1px)',
  },
  '55%': {
    transform: 'translateX(-1px)',
  },
  '75%': {
    transform: 'translateX(1px)',
  },
  to: {
    transform: 'translateX(0)',
  },
})

export const shake = style({
  animation: `${shakeKeyframe} 0.5s`,
})
