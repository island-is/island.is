import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'inline-block',
  borderBottom: `1px solid ${theme.color.blue400}`,
  height: '47px',
  lineHeight: '47px',
  fontSize: '20px',
})

export const containerWhite = style({
  borderBottom: `1px solid ${theme.color.white}`,
})

export const link = style({
  color: theme.color.blue400,

  ':hover': {
    textDecoration: 'none',
  }
})

export const linkWhite = style({
  color: theme.color.white,
})

export const icon = style({
  display: 'inline-block',
  position: 'relative',
  transition: 'transform .2s',
})

globalStyle(`${link}:hover ${icon}`, {
  transform: 'translateX(5px)',
})
