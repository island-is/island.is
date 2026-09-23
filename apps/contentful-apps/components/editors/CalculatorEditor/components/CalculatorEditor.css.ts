import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const fieldRow = style({
  border: `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.border.color.standard}`,
  borderRadius: theme.border.radius.standard,
  padding: theme.spacing[1],
})

export const section = style({
  border: `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.border.color.standard}`,
  borderRadius: theme.border.radius.large,
  padding: theme.spacing[2],
})

export const grow = style({ flex: 1 })

export const itemFields = style({
  borderLeft: `${theme.border.width.large}px ${theme.border.style.solid} ${theme.border.color.standard}`,
  paddingLeft: theme.spacing[2],
})

export const spanControl = style({ width: theme.spacing[12] })

export const sortableContent = style({ flex: 1, minWidth: 0 })

export const emptyDropZone = styleVariants({
  idle: {
    border: `${theme.border.width.standard}px dashed ${theme.border.color.standard}`,
  },
  active: {
    border: `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.border.color.standard}`,
  },
})

export const emptyDropZoneContent = style({
  borderRadius: theme.border.radius.standard,
  padding: theme.spacing.p2,
  textAlign: 'center',
})

export const hidden = style({ display: 'none' })
