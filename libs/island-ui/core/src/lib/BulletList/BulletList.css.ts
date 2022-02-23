import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  counterReset: 'section',
})

export const content = style({})

export const bullet = style({
  display: 'inline-block',
  width: '24px',
  ':before': {
    display: 'none',
    color: theme.color.red400,
    fontWeight: theme.typography.semiBold,
    counterIncrement: 'section',
    content: 'counter(section)',
  },
})

export const numbered = style({
  ':before': {
    display: 'inline-block',
  },
})

export const icon = style({
  position: 'relative',
  display: 'inline-block',
  top: '-2px',

  ':before': {
    content: ' ',
    display: 'block',
    width: theme.spacing[1],
    height: theme.spacing[1],
    backgroundColor: theme.color.red400,
    borderRadius: '50%',
  },
})

globalStyle(`${content} a`, {
  cursor: 'pointer',
  color: theme.color.blue400,
  textDecoration: 'none',
  boxShadow: `inset 0 -2px 0 0 currentColor`,
  transition: 'color .2s, box-shadow .2s',
  paddingBottom: 4,
})

globalStyle(`${content} a:hover`, {
  color: theme.color.blueberry400,
  boxShadow: `inset 0 -2px 0 0 ${theme.color.blueberry400}`,
})
