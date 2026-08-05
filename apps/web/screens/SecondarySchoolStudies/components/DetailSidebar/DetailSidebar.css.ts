import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const sidebar = style({
  position: 'sticky',
  top: 72,
  alignSelf: 'flexStart',
})

export const schoolIcon = style({
  maxWidth: '40px',
  maxHeight: '40px',
  width: '40px',
  height: '40px',
  objectFit: 'contain',
})

export const schoolIconSmall = style({
  maxWidth: '24px',
  maxHeight: '24px',
  width: '24px',
  height: '24px',
  objectFit: 'contain',
})

export const multipleSchoolsContainer = style({
  backgroundColor: theme.color.purple100,
  padding: '16px',
  borderRadius: '8px',
})

export const mobileSidebarFilterButton = style({})

globalStyle(`${mobileSidebarFilterButton} span`, {
  display: 'flex',
})
