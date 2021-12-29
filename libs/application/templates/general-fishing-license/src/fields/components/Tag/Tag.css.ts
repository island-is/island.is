import { styleVariants, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

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
})

export const variants = styleVariants({
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
  },
  mint: {
    color: theme.color.mint600,
    backgroundColor: theme.color.mint100,
  },
  rose: {
    color: theme.color.roseTinted400,
    backgroundColor: theme.color.roseTinted100,
  },
  blueberry: {
    color: theme.color.blueberry400,
    backgroundColor: theme.color.blueberry100,
  },
  dark: {
    color: theme.color.dark400,
    backgroundColor: theme.color.dark200,
  },
  label: {},
})

export const disabled = style({
  backgroundColor: theme.color.dark100,
  borderColor: theme.color.dark100,
  color: theme.color.dark200,
})
