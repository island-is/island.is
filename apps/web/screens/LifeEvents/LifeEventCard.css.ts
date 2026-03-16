import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  minHeight: 260,
  minWidth: 0,
  overflow: 'hidden',
})

export const purpleTags = style({})

globalStyle(`${purpleTags} a, ${purpleTags} button`, {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

globalStyle(`${purpleTags} a:hover, ${purpleTags} button:hover`, {
  backgroundColor: theme.color.purple400,
  color: theme.color.white,
})

export const image = style({
  width: '100%',
  height: 'auto',
  maxHeight: '100%',
  objectFit: 'contain',
})
