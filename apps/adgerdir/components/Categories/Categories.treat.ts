import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const filters = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  ...themeUtils.responsiveStyle({
    lg: {
      flexDirection: 'row',
    },
  }),
})

export const input = style({
  borderColor: theme.color.red200,
  boxSizing: 'border-box',
  color: theme.color.red600,
  borderWidth: 1,
  borderStyle: 'solid',
  backgroundColor: theme.color.transparent,
  height: 48,
  paddingLeft: 16,
  paddingRight: 42,
  fontWeight: 300,
  fontSize: 18,
  width: '100%',
  lineHeight: 1.555555,
  borderRadius: 8,
  outline: 0,
  '::placeholder': {
    color: theme.color.red600,
    fontWeight: theme.typography.light,
  },
})

export const inputWrapper = style({
  width: 318,
  position: 'relative',
})

export const inputIcon = style({
  position: 'absolute',
  display: 'inline-flex',
  height: '100%',
  right: 16,
  alignItems: 'center',
})
