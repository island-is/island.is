import { styleMap, style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import colors from '../colors'

export const container = style({
  borderRadius: theme.border.radius.large,
  transition: 'color 150ms ease, background-color 150ms ease',
  outline: 0,
  display: 'inline-flex',
  alignItems: 'center',
  height: 32,
  padding: '0 8px',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  maxWidth: '100%',
  border: '1px solid transparent',
  ':focus': {
    backgroundColor: colors.green200,
    color: theme.color.dark400,
  },
  ':hover': {
    textDecoration: 'none',
    backgroundColor: colors.green200,
    color: theme.color.white,
  },
})

export const variants = styleMap({
  green: {
    color: colors.green400,
    backgroundColor: colors.green100,
    ':focus': {
      backgroundColor: colors.green200,
      color: colors.green400,
    },
    ':hover': {
      textDecoration: 'none',
      backgroundColor: colors.green200,
      color: colors.green400,
    },
  },
  blue: {
    color: colors.blue400,
    backgroundColor: colors.blue100,
    ':focus': {
      backgroundColor: colors.blue200,
      color: colors.blue400,
    },
    ':hover': {
      textDecoration: 'none',
      backgroundColor: colors.blue200,
      color: colors.blue400,
    },
  },
  label: {},
})

export const bordered = style({
  selectors: {
    [`&${variants.green}`]: {
      borderColor: colors.green200,
    },
    [`&${variants.blue}`]: {
      borderColor: colors.blue200,
    },
  },
})

export const active = style({
  selectors: {
    [`&${variants.green}`]: {
      backgroundColor: theme.color.white,
      color: colors.green400,
    },
  },
})

export const label = style({
  pointerEvents: 'none',
})

export const attention = style({
  position: 'relative',
  selectors: {
    '&::after': {
      content: '""',
      background: theme.color.red400,
      borderRadius: '50%',
      height: 8,
      position: 'absolute',
      right: -4,
      top: -3,
      width: 8,
    },
  },
})
