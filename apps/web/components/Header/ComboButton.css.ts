import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const buttonBase = style({
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontStyle: 'normal',
  fontWeight: theme.typography.semiBold,
  borderRadius: theme.border.radius.large,
  fontSize: 12,
  lineHeight: 1.333333,
  minHeight: 40,
  padding: '0 12px',
  display: 'flex',
  alignItems: 'center',
  outline: 'none',
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${theme.color.blue200}`,
  transition: 'box-shadow .25s, color .25s',
  ':hover': {
    boxShadow: `inset 0 0 0 1px ${theme.color.blue400}`,
  },
  ':focus': {
    color: theme.color.dark400,
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  ':active': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
})

export const searchButton = style({
  borderRadius: `${theme.border.radius.large} 0 0 ${theme.border.radius.large}`,
  marginRight: '-1px',
})

export const menuButton = style({
  borderRadius: `0 ${theme.border.radius.large}  ${theme.border.radius.large} 0`,
})

export const buttonText = style({
  marginRight: '8px',
})

export const white = style({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${theme.color.white}`,
  color: theme.color.white,

  ':hover': {
    color: theme.color.white,
    boxShadow: `inset 0 0 0 1px ${theme.color.white}`,
    backgroundColor: theme.color.transparent,
  },
  ':focus': {
    color: theme.color.white,
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    backgroundColor: theme.color.transparent,
  },
  ':active': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
})
