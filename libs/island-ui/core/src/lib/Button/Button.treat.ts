import { styleMap, style } from 'treat'
import { theme } from '../../theme/index'

export const button = style({
  display: 'inline-flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '10px',
  outline: 0,
  border: 0,
  cursor: 'pointer',
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontStyle: 'normal',
  fontWeight: 600,
  transition: 'color 150ms ease, background-color 150ms ease',
  ':disabled': {
    pointerEvents: 'none',
  },
  ':focus': {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
  },
  ':after': {
    content: "''",
    position: 'absolute',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: '4px',
    borderColor: theme.color.mint400,
    borderRadius: '10px',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: 'opacity 150ms ease',
  },
})

const sizeMedium = {
  fontSize: '18px',
  lineHeight: '28px',
  height: '64px',
  padding: '0 32px',
}

const sizeLarge = {
  fontSize: '24px',
  lineHeight: '34px',
  height: '80px',
  padding: '0 32px',
}

export const sizes = styleMap({
  small: sizeMedium,
  medium: sizeMedium,
  large: sizeLarge,
})

export const variants = styleMap({
  normal: {
    backgroundColor: theme.color.blue400,
    color: theme.color.white,
    ':disabled': {
      backgroundColor: theme.color.blue300,
    },
    ':hover': {
      color: theme.color.white,
      backgroundColor: theme.color.blueberry400,
    },
    ':active': {
      backgroundColor: theme.color.blueberry400,
    },
    selectors: {
      '&:hover:active:after': {
        opacity: 1,
      },
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: theme.color.blue400,
    ':disabled': {
      color: theme.color.blue300,
    },
    ':after': {
      opacity: 1,
      borderWidth: '1px',
      borderColor: theme.color.blue400,
      borderRadius: '10px',
    },
    ':hover': {
      color: theme.color.blueberry400,
    },
    ':focus': {
      color: theme.color.dark400,
    },
    ':active': {
      backgroundColor: 'transparent',
      color: theme.color.blue400,
    },
    selectors: {
      '&:disabled:after': {
        borderColor: theme.color.blue300,
      },
      '&:hover:after': {
        borderColor: theme.color.blueberry400,
      },
      '&:focus:after': {
        borderColor: theme.color.mint400,
      },
      '&:hover:active:after': {
        borderWidth: '4px',
        opacity: 1,
      },
    },
  },
  text: {
    backgroundColor: 'transparent',
    color: theme.color.blue400,
    borderRadius: 0,
    fontStyle: 'normal',
    padding: '0',
    fontWeight: 600,
    ':disabled': {
      color: theme.color.blue300,
    },
    ':after': {
      opacity: 1,
      borderWidth: '1px',
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: theme.color.blue400,
      borderRadius: 0,
    },
    ':hover': {
      color: theme.color.blueberry400,
    },
    selectors: {
      '&:disabled:after': {
        borderColor: theme.color.blue300,
      },
      [`&${sizes.small}`]: {
        height: '24px',
        fontSize: '14px',
        lineHeight: '16px',
      },
      [`&${sizes.medium}`]: {
        height: '36px',
        fontSize: '18px',
        lineHeight: '28px',
      },
      [`&${sizes.large}`]: {
        height: '42px',
        fontSize: '24px',
        lineHeight: '34px',
      },
      '&:focus:hover': {
        color: theme.color.dark400,
      },
      '&:hover:after': {
        borderColor: theme.color.blueberry400,
      },
      '&:focus:active, &:active': {
        backgroundColor: theme.color.mint400,
        color: theme.color.blue400,
      },
      '&:focus:after': {
        borderColor: theme.color.dark400,
      },
      '&:focus:active:after, &:hover:active:after': {
        borderWidth: '1px',
        borderColor: theme.color.blue400,
        opacity: 1,
      },
    },
  },
})
