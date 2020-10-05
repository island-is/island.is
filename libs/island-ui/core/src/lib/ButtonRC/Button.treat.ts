import { Style, styleMap } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const buttonBase = {
  fontWeight: theme.typography.semiBold,
  borderRadius: 8,
  outline: 'none',
  transition: 'box-shadow .25s, color .25s, background-color .25s',
  ':focus': {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
  },
  ':active': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
}
const textBase = {
  fontWeight: theme.typography.semiBold,
  outline: 'none',
  cursor: 'pointer',
  transition: 'box-shadow .25s, color .25s, background-color .25s',

  ':focus': {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
    boxShadow: `inset 0 -1px 0 0 ${theme.color.dark400}`,
  },
  ':disabled': {
    cursor: 'normal',
  },
  selectors: {
    // text button uses span instead of button and data active is used to emulate button active, span is used to make text button inline, because button element will default to inline-block if you use display: inline
    '&[data-active="true"]': {
      boxShadow: `inset 0 -3px 0 0 ${theme.color.mint400}`,
    },
    '&[data-active="true"]:focus': {
      backgroundColor: 'transparent',
      boxShadow: `inset 0 -3px 0 0 ${theme.color.mint400}`,
    },
  },
}

export const variants = styleMap({
  primary: buttonBase,
  ghost: buttonBase,
  text: textBase,
})

export const size = styleMap({
  default: {
    fontSize: 16,
    lineHeight: 1.25,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 18,
        lineHeight: 1.6,
      },
    }),
  },
  small: {
    fontSize: 16,
    lineHeight: 1.25,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 18,
        lineHeight: 1.6,
      },
    }),
  },
  large: {
    fontSize: 20,
    lineHeight: 1.4,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 24,
        lineHeight: 1.42,
      },
    }),
  },
})

export const padding = styleMap({
  text: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  default: {
    padding: '14px 16px',
    ...themeUtils.responsiveStyle({
      md: {
        padding: '18px 24px',
      },
    }),
  },
  small: {
    padding: '10px 16px',
  },
  large: {
    padding: '18px 24px',
    ...themeUtils.responsiveStyle({
      md: {
        padding: '23px 32px',
      },
    }),
  },
})

type PrimaryColors = (
  main: string,
  text: string,
  hover: string,
  disabled: string,
) => Style

type GhostColors = (main: string, hover: string, disabled: string) => Style

const primaryColors: PrimaryColors = (main, text, hover, disabled) => ({
  backgroundColor: main,
  color: text,
  ':disabled': {
    backgroundColor: disabled,
  },
  ':hover': {
    backgroundColor: hover,
  },
  ':active': {
    backgroundColor: hover,
  },
  selectors: {
    '&:focus:hover': {
      color: text,
    },
    '&:focus:active': {
      color: text,
    },
  },
})
const ghostColors: GhostColors = (main, hover, disabled) => ({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${main}`,
  color: main,
  ':disabled': {
    boxShadow: `inset 0 0 0 1px ${disabled}`,
    color: disabled,
  },
  ':focus': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  ':hover': {
    backgroundColor: theme.color.transparent,
    boxShadow: `inset 0 0 0 1px ${hover}`,
    color: hover,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
  },
})
const textColors: GhostColors = (main, hover, disabled) => ({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 -1px 0 0 ${main}`,
  color: main,
  ':disabled': {
    boxShadow: `inset 0 -1px 0 0 ${disabled}`,
    color: disabled,
  },
  ':focus': {
    boxShadow: `inset 0 -1px 0 0 ${theme.color.dark400}`,
  },
  ':hover': {
    backgroundColor: theme.color.transparent,
    boxShadow: `inset 0 -1px 0 0 ${hover}`,
    color: hover,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 -3px 0 0 ${theme.color.mint400}`,
    },
  },
})

export const colors = {
  primary: styleMap({
    default: primaryColors(
      theme.color.blue400,
      theme.color.white,
      theme.color.blueberry400,
      theme.color.blue300,
    ),
    destructive: primaryColors(
      theme.color.red600,
      theme.color.white,
      theme.color.roseTinted400,
      theme.color.red200,
    ),
  }),
  ghost: styleMap({
    default: ghostColors(
      theme.color.blue400,
      theme.color.blueberry400,
      theme.color.blue300,
    ),
    destructive: ghostColors(
      theme.color.red600,
      theme.color.roseTinted400,
      theme.color.red200,
    ),
  }),
  text: styleMap({
    default: textColors(
      theme.color.blue400,
      theme.color.blueberry400,
      theme.color.blue300,
    ),
    destructive: textColors(
      theme.color.red600,
      theme.color.roseTinted400,
      theme.color.red200,
    ),
  }),
}
