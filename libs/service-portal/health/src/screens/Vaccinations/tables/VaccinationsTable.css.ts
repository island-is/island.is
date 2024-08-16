import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const table = style({
  textOverflow: 'ellipsis',
})

export const footerList = style({
  listStyle: 'disc',
})

globalStyle(`${table} tbody tr:nth-child(odd) > td`, {
  backgroundColor: theme.color.white,
})

globalStyle(`${table} tbody td`, {
  border: 'none',
})

globalStyle(`${table} thead th`, {
  border: 'none',
})
