import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const table = style({
  textOverflow: 'ellipsis',
})

export const footerList = style({
  listStyle: 'disc',
})

export const noVaccinesText = style({
  height: 160,
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

globalStyle(`${noVaccinesText} p`, {
  position: 'relative',
  overflow: 'hidden',
  fontStyle: 'italic',
  textAlign: 'center',
  top: '43%',
})

globalStyle(`${noVaccinesText} p::after`, {
  position: 'absolute',
  top: '51%',
  overflow: 'hidden',
  width: '32%',
  height: '1px',
  content: "'a0'",
  backgroundColor: theme.color.blue200,
  right: 0,
})

globalStyle(`${noVaccinesText} p::before`, {
  position: 'absolute',
  top: '51%',
  overflow: 'hidden',
  width: '32%',
  height: '1px',
  content: "'a0'",
  backgroundColor: theme.color.blue200,
  left: 0,
})
