import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const tagList = style({})

globalStyle(`${tagList} button, ${tagList} a, ${tagList} span`, {
  maxWidth: '100%',
  minWidth: 0,
})

export const tagLabel = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flex: 1,
})

export const scrollList = style({
  maxHeight: 200,
  overflowY: 'auto',
  paddingTop: theme.spacing[2],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
})
