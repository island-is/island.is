import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const chapterContainer = style({
  display: 'flex',
  position: 'relative',
  backgroundColor: '#fff',
  border: `1px solid ${theme.color.blue400}`,
  borderRadius: theme.border.radius.large,
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
})

export const reorderGroup = style({
  position: 'relative',
})

export const reorderItem = style({
  position: 'relative',
  borderRadius: theme.border.radius.large,
  overflow: 'hidden',
})

export const reorderItemAnimationWrapper = style({
  width: '100%',
  height: `${theme.spacing[7]}px`,
  lineHeight: `${theme.spacing[7]}px`,
})

export const simpleInput = style({
  height: `${theme.spacing[6]}px`,
  borderRadius: theme.border.radius.large,
  border: `1px solid ${theme.color.blue200}`,
})
