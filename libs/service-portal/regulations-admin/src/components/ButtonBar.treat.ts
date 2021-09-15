import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const { border, spacing } = theme

const halfGap = spacing[1]

export const wrapper = style({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: -halfGap,
  marginRight: -halfGap,
})

export const back = style({
  order: -1,
  marginRight: 'auto',
})
export const forward = style({
  order: 1,
  marginLeft: 'auto',
})

export const deleteDraft = style({
  marginLeft: halfGap,
  marginRight: halfGap,
})
export const saveDraft = deleteDraft

export const propose = style({
  marginLeft: halfGap,
  marginRight: halfGap,
})
