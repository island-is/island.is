import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const userControlContainer = style({
  display: 'grid',
  gridColumnGap: 24,
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridTemplateRows: 'repeat(3, auto)',
  maxWidth: '1440px',
  margin: `${theme.spacing[12]}px auto`,
  padding: `0 ${theme.spacing[6]}px`,
})

export const logoContainer = style({
  display: 'flex',
  gridColumn: '1 / -1',
  marginBottom: theme.spacing[9],
})

export const userTable = style({
  gridRow: '3',
  gridColumn: '1 / -1',

  // Needed for Safari.
  width: '100%',
})

export const userError = style({
  gridRow: '2',
  gridColumn: '1 / 5',
})

export const thead = style({
  background: theme.color.blue100,
  boxShadow: `inset 0px -1px 0px ${theme.color.blue200}`,
})

export const tableRowContainer = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  cursor: 'pointer',
  transition: 'all .5s ease-in-out',
})

export const th = style({
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
})

export const td = style({
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
})
