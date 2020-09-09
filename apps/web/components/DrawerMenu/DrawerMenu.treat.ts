import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  zIndex: 9,
  left: 0,
  margin: '0 auto',
  right: 0,
  transition: 'transform 300ms ease-out',
  width: `calc(100% - ${theme.spacing[6]}px)`,
  willChange: 'transform',
})

export const mainHeader = style({
  borderTopLeftRadius: theme.border.radius.large,
  borderTopRightRadius: theme.border.radius.large,
})

export const top = style({
  borderBottom: `1px solid ${theme.color.purple200}`,
})

export const sticky = style({
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'sticky',
  top: 16,
})

export const category = style({
  flex: 1,
  selectors: {
    ['& + &']: {
      marginTop: theme.spacing[3],
    },
  },
})
