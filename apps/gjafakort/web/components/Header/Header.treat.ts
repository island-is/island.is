import { style } from 'treat'

export const root = style((theme) => ({
  height: theme.spacing20,
  borderBottom: `1px solid ${theme.gray50}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))
