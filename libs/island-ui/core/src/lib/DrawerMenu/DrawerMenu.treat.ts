import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  display: 'flex',
  flexDirection: 'column',
})

export const top = style({
  borderBottom: `1px solid ${theme.color.purple200}`,
})

export const category = style({
  selectors: {
    ['& + &']: {
      marginTop: theme.spacing[3],
    },
  },
})
