import {
  keyframes,
  style,
  StyleRule,
  styleVariants,
} from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import covidColors from '../colors'

// this is used to generate uniqe classname for button so we can target empty styles for icon
export const isEmpty = style({})

const buttonBase = {
  display: 'flex',
  alignItems: 'center',
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
    cursor: 'default',
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

export const fluid = style({
  width: '100%',
  justifyContent: 'center',
})

export const variants = styleVariants({
  primary: buttonBase,
  ghost: buttonBase,
  text: textBase,
  utility: buttonBase,
})

export const size = styleVariants({
  default: {
    fontSize: 16,
    lineHeight: 1.25,
    minHeight: 48,
    ...themeUtils.responsiveStyle({
      md: {
        minHeight: 64,
        fontSize: 18,
        lineHeight: 1.6,
      },
    }),
  },
  small: {
    fontSize: 16,
    lineHeight: 1.25,
    minHeight: 40,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 18,
        lineHeight: 1.6,
        minHeight: 48,
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
  utility: {
    fontSize: 12,
    lineHeight: 1.333333,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 14,
        lineHeight: 1.142857,
        minHeight: 48,
      },
    }),
  },
  textSmall: {
    fontSize: 12,
    lineHeight: 1.25,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 14,
        lineHeight: 1.6,
      },
    }),
  },
})

export const padding = styleVariants({
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
  utility: {
    padding: '12px 16px',
    ...themeUtils.responsiveStyle({
      md: {
        padding: '16px',
      },
    }),
  },
})

export const circleSizes = styleVariants({
  default: {
    width: 32,
    height: 32,
    ...themeUtils.responsiveStyle({
      md: {
        width: 40,
        height: 40,
      },
    }),
  },
  small: {
    width: 24,
    height: 24,
  },
  large: {
    width: 48,
    height: 48,
    ...themeUtils.responsiveStyle({
      md: {
        width: 64,
        height: 64,
      },
    }),
  },
})

type PrimaryColors = (
  main: string,
  text: string,
  hover: string,
  disabled: string,
  textDisabled?: string,
) => StyleRule

type BorderedColors = (
  main: string,
  hover: string,
  disabled: string,
) => StyleRule
type UtilityColors = (
  text: string,
  border: string,
  textHover: string,
  borderHover: string,
  textDisabled: string,
  borderDisabled: string,
) => StyleRule

const primaryColors: PrimaryColors = (
  main,
  text,
  hover,
  disabled,
  textDisabled = text,
) => ({
  backgroundColor: main,
  color: text,
  ':disabled': {
    backgroundColor: disabled,
    color: textDisabled,
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
const ghostColors: BorderedColors = (main, hover, disabled) => ({
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
    boxShadow: `inset 0 0 0 2px ${hover}`,
    color: hover,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
  },
})
const textColors: BorderedColors = (main, hover, disabled) => ({
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
    boxShadow: `inset 0 -2px 0 0 ${hover}`,
    color: hover,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 -3px 0 0 ${theme.color.mint400}`,
    },
  },
})
const utilityColors: UtilityColors = (
  text,
  border,
  textHover,
  borderHover,
  textDisabled,
  borderDisabled,
) => ({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${border}`,
  color: text,
  ':disabled': {
    boxShadow: `inset 0 0 0 1px ${borderDisabled}`,
    color: textDisabled,
  },
  ':focus': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  ':hover': {
    backgroundColor: theme.color.transparent,
    boxShadow: `inset 0 0 0 2px ${borderHover}`,
    color: textHover,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
  },
})

export const colors = {
  primary: styleVariants({
    default: primaryColors(
      covidColors.green400,
      theme.color.white,
      covidColors.green400,
      covidColors.green200,
    ),
  }),
  ghost: styleVariants({
    default: ghostColors(
      covidColors.green400,
      covidColors.green400,
      covidColors.green200,
    ),
  }),
  text: styleVariants({
    default: textColors(
      covidColors.green400,
      theme.color.blueberry400,
      theme.color.blue300,
    ),
  }),
  utility: styleVariants({
    default: utilityColors(
      theme.color.dark400,
      theme.color.blue200,
      theme.color.dark400,
      covidColors.green400,
      theme.color.dark200,
      theme.color.blue100,
    ),
  }),
}

export const circle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  padding: 0,
})

const utilityIconColor = (
  scheme: keyof typeof colors.utility,
  color: string,
  hovercolor: string,
) => ({
  [`${variants.utility}${colors.utility[scheme]}:not(:focus) &`]: {
    color: color,
  },
  [`${variants.utility}${colors.utility[scheme]}:active &`]: {
    color: color,
  },
  [`${variants.utility}${colors.utility[scheme]}:hover &`]: {
    color: hovercolor,
  },
})

export const icon = style({
  width: 16,
  height: 16,
  marginLeft: 15,
  ...themeUtils.responsiveStyle({
    md: {
      width: 24,
      height: 24,
    },
  }),
  selectors: {
    [`${isEmpty} &, ${circle} &`]: {
      marginLeft: 0,
    },
    [`${size.small} &, ${variants.utility} &, ${size.textSmall} &, ${circleSizes.small} &`]:
      {
        width: 16,
        height: 16,
      },
    [`${variants.utility}:not(${isEmpty}) &, ${variants.text}:not(${isEmpty}) &`]:
      {
        marginLeft: 8,
      },
    [`${variants.text}${size.textSmall}:not(${isEmpty}) &`]: {
      marginLeft: 4,
    },
    [`${variants.text}:not(${size.textSmall}) &`]: {
      marginBottom: -5,
    },
    [`${size.textSmall} &`]: {
      marginBottom: -3,
    },
    ...utilityIconColor(
      'default',
      covidColors.green400,
      theme.color.blueberry400,
    ),
  },
})

export const loadingCircle = style({})

export const hideContent = style({
  color: 'transparent',
})

export const loading = style({
  position: 'relative',
})

export const loader = style({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const dotAnimation = keyframes({
  '0%': {
    transform: 'scale(1)',
    opacity: 1,
  },
  '50%': {
    transform: 'scale(0.8)',
    opacity: 0.4,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
})

export const loadingDot = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: 'currentcolor',
  selectors: {
    '&:not(:last-child)': {
      marginRight: 10,
    },
    '&:nth-child(2)': {
      animationDelay: '0.4s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.8s',
    },
    [`${loadingCircle} &:nth-child(2), ${loadingCircle} &:nth-child(3)`]: {
      display: 'none',
    },
    [`${loadingCircle} &`]: {
      width: 16,
      height: 16,
      marginRight: 0,
    },
  },
  animation: `${dotAnimation} 1.4s forwards cubic-bezier(0.59, 0.01, 0.39, 1) infinite`,
})
