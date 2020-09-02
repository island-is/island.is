import { styleMap, style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: '5px',
  transition: 'color 150ms ease, background-color 150ms ease',
  outline: 0,
  display: 'inline-flex',
  alignItems: 'center',
  height: 32,
  padding: '0 8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textDecoration: 'none',
  maxWidth: '100%',
  border: '1px solid transparent',

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

export const variants = styleMap({
  blue: {
    color: theme.color.blue400,
    backgroundColor: theme.color.blue100,
  },
  darkerBlue: {
    color: theme.color.blue600,
    backgroundColor: theme.color.blue200,
  },
  white: {
    color: theme.color.blue400,
    backgroundColor: theme.color.white,
  },
  purple: {
    color: theme.color.purple400,
    backgroundColor: theme.color.purple100,
  },
  red: {
    color: theme.color.red600,
    backgroundColor: theme.color.red100,
    ':focus': {
      backgroundColor: theme.color.red200,
      color: theme.color.red600,
    },
    ':hover': {
      textDecoration: 'none',
      backgroundColor: theme.color.red200,
      color: theme.color.red600,
    },
  },
  mint: {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint100,
  },
  darkerMint: {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint200,
  },
  label: {},
})

export const bordered = style({
  selectors: {
    [`&${variants.blue}`]: {
      borderColor: theme.color.blue200,
    },
    [`&${variants.darkerBlue}`]: {
      borderColor: theme.color.blue300,
    },
    [`&${variants.white}`]: {
      borderColor: theme.color.blue400,
    },
    [`&${variants.purple}`]: {
      borderColor: theme.color.purple200,
    },
    [`&${variants.red}`]: {
      borderColor: theme.color.red200,
    },
    [`&${variants.mint}`]: {
      borderColor: theme.color.mint200,
    },
    [`&${variants.darkerMint}`]: {
      borderColor: theme.color.mint300,
    },
  },
})

export const active = style({
  selectors: {
    [`&${variants.red}`]: {
      backgroundColor: theme.color.white,
      color: theme.color.red600,
    },
  },
})

export const label = style({
  pointerEvents: 'none',
})
