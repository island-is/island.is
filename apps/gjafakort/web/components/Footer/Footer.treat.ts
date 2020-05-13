import { style } from 'treat'

export const root = style((theme) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: theme.spacing20,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: `1px solid ${theme.gray50}`,
}))
