import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const border = `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.color.dark100}`

export const wrapper = style({
  borderBottom: `${border}`,
  borderRight: `${border}`,
})
