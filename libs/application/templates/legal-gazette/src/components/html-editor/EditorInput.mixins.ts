// Based on libs/island-ui/core/src/lib/Input/Input.mixins.ts
import { theme, themeUtils } from '@island.is/island-ui/theme'

const labelFontSize = 14
const mobileLabelFontSize = 12
const inputBorderRadius = 8

export const label = {
  display: 'block',
  width: '100%',
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
  fontSize: mobileLabelFontSize,
  lineHeight: 1.3333333333,
  transition: 'color 0.1s',
  padding: '8px 8px 0',
  marginBottom: 6,
  ...themeUtils.responsiveStyle({
    md: {
      lineHeight: 1.1428571429,
      fontSize: labelFontSize,
      marginBottom: 8,
    },
  }),
}

export const container = {
  backgroundColor: theme.color.white,
  width: '100%',
  boxShadow: `inset 0 0 0 1px ${theme.color.blue200}`,
  borderBottomRightRadius: inputBorderRadius,
  borderBottomLeftRadius: inputBorderRadius,
  cursor: 'text',
  transition: 'box-shadow 0.3s',
  padding: '0 0 16px 0',
  ...themeUtils.responsiveStyle({
    md: {
      padding: '0 0 14px 0',
    },
  }),
}

// Error state
export const errorMessage = {
  color: theme.color.red600,
  fontWeight: theme.typography.medium,
  fontSize: labelFontSize,
  marginTop: theme.spacing[1],
}

export const inputErrorState = {
  boxShadow: `inset 0 0 0 1px ${theme.color.red600}`,
}

export const labelErrorState = {
  color: theme.color.red600,
}

// Focus state
export const containerFocus = {
  outline: 'none',
  boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
}

// Hover state
export const containerHover = {
  boxShadow: `inset 0 0 0 1px ${theme.color.blue400}`,
}
