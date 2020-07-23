import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const border = `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.color.dark100}`

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  borderBottom: border,
  height: '80px',
  padding: `0 ${theme.spacing['6']}px`,
})

export const divider = style({
  height: '100%',
  borderRight: `1px solid ${theme.color.dark100}`,
})
