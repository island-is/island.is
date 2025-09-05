import { style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const hasLabel = style({
  padding: '16px 46px 0 16px',
})

export const input = style({
  appearance: 'none',
  position: 'relative',
  width: '100%',
  borderRadius: theme.border.radius.large,
  background: theme.color.white,
  fontWeight: theme.typography.light,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  padding: 16,
  borderStyle: 'solid',
  outline: 0,
  transition: 'border-color 150ms ease',
  ':hover': {
    borderColor: theme.color.blue400,
  },
  selectors: {
    [`&:focus:hover`]: {
      borderColor: theme.color.transparent,
    },
  },
})

export const open = style({
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderColor: theme.color.blue200,
  selectors: {
    [`&:focus:hover`]: {
      borderColor: theme.color.blue200,
    },
  },
})

export const colored = style({
  background: theme.color.blue100,
  borderColor: theme.color.blue200,
  selectors: {
    [`&:focus:hover`]: {
      borderColor: theme.color.blue200,
    },
  },
})

export const sizes = styleVariants({
  medium: {
    paddingRight: 36,
    height: 40,
    fontSize: 16,
    ...themeUtils.responsiveStyle({
      md: {
        paddingRight: 52,
        height: 48,
        fontSize: 18,
      },
    }),
  },
  'semi-large': {
    paddingRight: 40,
    height: 56,
    fontSize: 16,
    ...themeUtils.responsiveStyle({
      md: {
        paddingRight: 56,
        height: 64,
        fontSize: 18,
      },
    }),
  },
  large: {
    paddingRight: 72,
    height: 72,
    fontSize: 20,
    ...themeUtils.responsiveStyle({
      md: {
        paddingRight: 96,
        height: 80,
        fontSize: 24,
      },
    }),
  },
})

export const white = style({
  backgroundColor: theme.color.transparent,
  color: theme.color.white,
  transition: 'box-shadow .25s',
  '::placeholder': {
    color: theme.color.white,
  },
  ':focus': {
    backgroundColor: theme.color.transparent,
    color: theme.color.white,
  },
  ':hover': {
    borderColor: theme.color.white,
    boxShadow: `inset 0 0 0 ${1}px ${theme.color.white}`,
  },
  selectors: {
    [`&:focus:hover`]: {
      backgroundColor: theme.color.transparent,
      boxShadow: 'none',
    },
  },
})

export const blueberry = style({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${theme.color.blueberry600}`,
  border: 'none',
  color: theme.color.blueberry600,
  transition: 'box-shadow .25s',
  ':focus': {
    boxShadow: 'none',
    border: 'none',
  },
  ':hover': {
    boxShadow: `inset 0 0 0 ${2}px ${theme.color.blueberry600}`,
  },
  '::placeholder': {
    color: theme.color.blueberry600,
  },
  selectors: {
    [`&:focus:hover`]: {
      boxShadow: 'none',
      border: 'none',
    },
  },
})

export const blue = style({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${theme.color.blue600}`,
  border: 'none',
  color: theme.color.blue600,
  transition: 'box-shadow .25s',
  ':focus': {
    boxShadow: 'none',
    border: 'none',
  },
  ':hover': {
    boxShadow: `inset 0 0 0 ${2}px ${theme.color.blue600}`,
  },
  '::placeholder': {
    color: theme.color.blue600,
  },
  selectors: {
    [`&:focus:hover`]: {
      boxShadow: 'none',
      border: 'none',
    },
  },
})

export const dark = style({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${theme.color.dark400}`,
  border: 'none',
  color: theme.color.dark400,
  transition: 'box-shadow .25s',
  ':focus': {
    boxShadow: 'none',
    border: 'none',
  },
  ':hover': {
    boxShadow: `inset 0 0 0 ${2}px ${theme.color.dark400}`,
  },
  '::placeholder': {
    color: theme.color.dark400,
  },
  selectors: {
    [`&:focus:hover`]: {
      boxShadow: 'none',
      border: 'none',
    },
  },
})

export const hasError = style({
  borderColor: `${theme.color.red600}`,
  background: `${theme.color.red100}`,
})

export const isCompanySearch = style({
  paddingTop: 32,
  paddingLeft: 20,
  paddingBottom: 8,
  fontWeight: theme.typography.medium,
})
