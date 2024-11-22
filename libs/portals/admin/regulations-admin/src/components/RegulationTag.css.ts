import { styleVariants, style } from '@vanilla-extract/css'
import { spacing, theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: theme.border.radius.default,
  transition: 'color 150ms ease, background-color 150ms ease',
  outline: 0,
  display: 'inline-flex',
  alignItems: 'center',
  height: 32,
  padding: '0 8px',
  textDecoration: 'none',
  maxWidth: '100%',
  border: '1px solid transparent',
})

export const truncate = style({
  whiteSpace: 'nowrap',
})

export const variants = styleVariants({
  blue: {
    color: theme.color.blue400,
    backgroundColor: theme.color.blue100,
  },
  disabled: {
    backgroundColor: theme.color.dark100,
    color: theme.color.dark200,
  },
  label: {},
})

export const active = style({
  selectors: {
    [`&${variants.blue}`]: {
      backgroundColor: theme.color.blue400,
      color: theme.color.white,
    },
  },
})

export const focusable = style({
  ':focus': {
    backgroundColor: theme.color.mint400,
    color: theme.color.dark400,
  },
  ':hover': {
    textDecoration: 'none',
    backgroundColor: theme.color.blue400,
    color: theme.color.white,
  },
})

export const closeIcon = style({
  verticalAlign: 'middle',
  marginLeft: spacing[1],
})
