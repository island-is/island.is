import { styleMap, style } from 'treat'
import { theme } from '../../theme/index'

export const button = style({
  display: 'inline-flex',
  position: 'relative',
  justifyContent: 'center',
  alignContent: 'center',
  borderRadius: '10px',
  outline: 0,
  border: 0,
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontStyle: 'normal',
  fontWeight: 600,
  transition: 'color 150ms ease, background-color 150ms ease',
  selectors: {
    '&:disabled': {
      pointerEvents: 'none',
    },
    '&:focus': {
      color: theme.color.dark400,
      backgroundColor: theme.color.mint400,
    },
    '&:after': {
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
  },
})

export const sizes = styleMap({
  normal: {
    fontSize: '18px',
    lineHeight: '28px',
    height: '64px',
    padding: '0 32px',
  },
  large: {
    fontSize: '24px',
    lineHeight: '34px',
    height: '80px',
    padding: '0 32px',
  },
})

const textButtonSize = {
  height: '42px',
  padding: '0',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '24px',
  lineHeight: '34px',
}

export const variants = styleMap({
  default: {
    backgroundColor: theme.color.blue400,
    color: theme.color.white,
    selectors: {
      '&:disabled': {
        backgroundColor: theme.color.blue300,
      },
      '&:hover': {
        color: theme.color.white,
        backgroundColor: theme.color.blueberry400,
      },
      '&:active': {
        backgroundColor: theme.color.blueberry400,
      },
      '&:hover:active:after': {
        opacity: 1,
      },
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: theme.color.blue400,
    selectors: {
      '&:disabled': {
        color: theme.color.blue300,
      },
      '&:disabled:after': {
        borderColor: theme.color.blue300,
      },
      '&:after': {
        opacity: 1,
        borderWidth: '1px',
        borderColor: theme.color.blue400,
        borderRadius: '10px',
      },
      '&:hover': {
        color: theme.color.blueberry400,
      },
      '&:hover:after': {
        borderColor: theme.color.blueberry400,
      },
      '&:focus': {
        color: theme.color.dark400,
      },
      '&:focus:after': {
        borderColor: theme.color.mint400,
      },
      '&:active': {
        backgroundColor: 'transparent',
        color: theme.color.blue400,
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
    selectors: {
      [`&${sizes.normal}, &${sizes.large}`]: textButtonSize,
      '&:after': {
        opacity: 1,
        borderWidth: '1px',
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        borderColor: theme.color.blue400,
        borderRadius: 0,
      },
      '&:hover': {
        color: theme.color.blueberry400,
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
