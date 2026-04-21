import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const purpleTags = style({})

globalStyle(`${purpleTags} a:hover, ${purpleTags} button:hover`, {
  backgroundColor: theme.color.purple400,
  color: theme.color.white,
})

export const truncatedTags = style({})

globalStyle(`${truncatedTags} a, ${truncatedTags} button`, {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
