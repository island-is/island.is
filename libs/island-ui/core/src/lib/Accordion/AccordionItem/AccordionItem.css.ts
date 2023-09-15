import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import { recipe } from '@vanilla-extract/recipes'

export const button = style({})

export const iconTilted = style({
  transform: 'rotate(45deg)',
})

export const focusRing = [
  style({
    selectors: {
      [`${button}:focus ~ &`]: {
        opacity: 1,
      },
    },
  }),
  style({
    top: -theme.spacing[1],
    bottom: -theme.spacing[1],
    left: -theme.spacing[1],
    right: -theme.spacing[1],
  }),
]

export const card = recipe({
  base: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    borderWidth: 1,
    boxSizing: 'border-box',
    borderStyle: 'solid',
    transition: 'border-color 150ms ease',
    borderRadius: theme.border.radius.large,
    textDecoration: 'none',
    position: 'relative',
    ':hover': {
      borderWidth: 1,
      textDecoration: 'none',
    },
    ':focus': {
      outline: 0,
    },
    '::before': {
      content: "''",
      display: 'inline-block',
      position: 'absolute',
      pointerEvents: 'none',
      borderStyle: 'solid',
      borderWidth: 3,
      borderColor: theme.color.transparent,
      borderRadius: 10,
      top: -3,
      left: -3,
      bottom: -3,
      right: -3,
      opacity: 0,
      transition: 'border-color 150ms ease, opacity 150ms ease',
    },
    selectors: {
      [`&:focus::before`]: {
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: theme.color.mint400,
        opacity: 1,
        outline: 0,
      },
      [`&:focus:hover`]: {
        borderColor: theme.color.white,
      },
    },
  },
  variants: {
    color: {
      blue: {
        borderColor: theme.color.blue200,
        ':hover': {
          borderColor: theme.color.blue400,
        },
      },
      red: {
        borderColor: theme.color.red200,
        ':hover': {
          borderColor: theme.color.red600,
        },
      },
    },
  },
  defaultVariants: {
    color: 'blue',
  },
})

export const focused = style({
  '::before': {
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.color.mint400,
    opacity: 1,
    outline: 0,
  },
  ':hover': {
    borderColor: theme.color.white,
  },
})

const iconWrapSizes = {
  default: 40,
  small: 24,
  sidebar: 20,
}

export const plusIconWrap = recipe({
  base: {
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  variants: {
    color: {
      blue: {
        backgroundColor: theme.color.blue100,
        color: theme.color.blue400,
      },
      red: {
        backgroundColor: theme.color.red100,
        color: theme.color.red600,
      },
      purple: {
        backgroundColor: theme.color.purple200,
        color: theme.color.purple400,
      },
    },
    iconVariant: {
      default: {
        width: iconWrapSizes.default,
        height: iconWrapSizes.default,
      },
      small: {
        width: iconWrapSizes.small,
        height: iconWrapSizes.small,
      },
      sidebar: {
        width: iconWrapSizes.sidebar,
        height: iconWrapSizes.sidebar,
      },
    },
  },
  defaultVariants: {
    color: 'blue',
    iconVariant: 'default',
  },
})

export const icon = style({
  position: 'absolute',
  display: 'flex',
  left: '50%',
})

export const addIcon = style({
  transform: 'translateX(-50%) rotateZ(0deg)',
  opacity: 1,
  transition: 'opacity 150ms ease, transform 300ms ease',
})

export const removeIcon = style({
  transform: 'translateX(-50%) rotateZ(-90deg)',
  opacity: 0,
  transition: 'opacity 150ms ease, transform 300ms ease',
})

export const showRemoveIcon = style({
  transform: 'translateX(-50%) rotateZ(0deg)',
  opacity: 1,
})

export const hideAddIcon = style({
  transform: 'translateX(-50%) rotateZ(90deg)',
  opacity: 0,
})
