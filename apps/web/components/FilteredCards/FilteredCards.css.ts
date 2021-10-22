import { style } from '@vanilla-extract/css'
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

export const filtersToggler = style({
  position: 'relative',
  display: 'inline-block',
  outline: 0,
  color: theme.color.blue600,
  lineHeight: 1.466666,
  fontWeight: theme.typography.medium,
  boxShadow: `inset 0 -1px 0 0 ${theme.color.blue600}`,
  ':after': {
    content: '""',
    position: 'absolute',
    left: -10,
    right: -10,
    top: -10,
    bottom: -10,
  },
})

export const filtersIcon = style({
  position: 'relative',
  display: 'inline-block',
  transform: `rotate(180deg)`,
  transition: `transform 300ms ease`,
})

export const filtersIconToggled = style({
  transform: `rotate(0deg)`,
})

export const input = style({
  borderColor: theme.color.blue200,
  boxSizing: 'border-box',
  color: theme.color.blue600,
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
    color: theme.color.blue600,
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
  color: theme.color.blue600,
})
