import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  fontFamily: theme.typography.fontFamily,
  marginTop: 40,
  marginBottom: 40,
})

export const description = style({
  paddingTop: 3,
  marginBottom: 30,
})

export const selectContainer = style({
  width: '200',
})

export const section = style({
  paddingBottom: 50,
})

export const sectionTitle = style({
  paddingTop: 40,
})

export const categoryContainer = style({
  display: 'flex',
  flexDirection: 'row',
})

export const category = style({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

export const categoryItem = style({
  color: theme.color.blue400,
  background: theme.color.blue100,
  borderRadius: 5,
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 8,
  paddingRight: 8,
  fontSize: 14,
  minWidth: 40,
  marginLeft: 4,
  marginRight: 4,
  marginBottom: 3,
  display: 'flex',
  flexShrink: 0,
})
