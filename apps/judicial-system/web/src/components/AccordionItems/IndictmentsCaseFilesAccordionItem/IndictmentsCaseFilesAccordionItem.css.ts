import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const chapterContainer = style({
  display: 'flex',
  position: 'relative',
  backgroundColor: '#fff',
  border: `1px solid ${theme.color.blue400}`,
  borderRadius: theme.border.radius.default,
  padding: `12px 20px`,
})

export const reorderGroup = style({
  position: 'relative',
})

export const reorderItem = style({
  position: 'relative',
  overflow: 'hidden',
})
