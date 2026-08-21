import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const sectionNumber = style({
  borderRadius: '50%',
  fontWeight: theme.typography.semiBold,
  height: '32px',
  left: '-16px',
  top: 'calc(50% - 16px)',
  width: '32px',
})

export const sectionNumberText = style({
  marginLeft: '-1px',
})

export const sectionNumberSubGroup = style({
  background: theme.color.roseTinted400,
  border: `1px solid ${theme.color.roseTinted400}`,
})

export const sectionNumberMainGroup = style({
  background: theme.color.mint600,
})

export const container = style({
  borderRadius: theme.border.radius.large,
  transition: 'color 150ms ease, background-color 150ms ease',
  outline: 0,
  display: 'inline-flex',
  alignItems: 'center',
  height: 32,
  padding: '0 8px',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  maxWidth: '100%',
  border: '1px solid transparent',
  color: theme.color.mint600,
  backgroundColor: theme.color.mint100,
})
