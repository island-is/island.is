import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const defaultWidth = 400

export const x_links = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
})

export const x_linksContainer = style({
  marginTop: 10,
  marginBottom: 40,
})

export const x_link = style({
  padding: 8,
  borderRadius: 5,
  background: theme.color.blue100,
  whiteSpace: 'pre-wrap',
})
