import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const inputContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTopRightRadius: 8,
  borderTopLeftRadius: 8,
  padding: `${theme.spacing[1]}px ${theme.spacing[3]}px ${theme.spacing[1]}px ${theme.spacing[1]}px`,
  width: '100%',
  outline: 'none',
  border: `1px solid transparent`,

  ':active': {
    boxShadow: '0 0 0 4px transparent',
  },
  ':focus': {
    boxShadow: `0 0 0 4px ${theme.color.mint400}`,
  },
})

export const inputContainerVariants = styleMap({
  open: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    boxShadow: `0 0 0 4px ${theme.color.mint400}`,
    border: `1px solid transparent`,
  },
  closed: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    border: `1px solid ${theme.color.blue200}`,
  },
})

export const labelAndPlaceholderContainer = style({
  textAlign: 'left',
})

export const label = style({
  display: 'block',
  width: '100%',
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
  fontSize: 14,
  marginBottom: theme.spacing[1],
  transition: 'color 0.1s',
})

export const value = style({
  padding: `0 ${theme.spacing[2]}px`,
})

export const customHeaderContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.color.blue200}`,
  paddingBottom: theme.spacing[2],
  marginBottom: theme.spacing[2],
})

export const decreaseButton = style({
  transform: 'rotate(90deg)',
  outline: 'none',

  ':focus': {
    boxShadow: `0 0 0 4px ${theme.color.mint400}`,
  },
})

export const increaseButton = style({
  transform: 'rotate(-90deg)',
  outline: 'none',

  ':focus': {
    boxShadow: `0 0 0 4px ${theme.color.mint400}`,
  },
})
