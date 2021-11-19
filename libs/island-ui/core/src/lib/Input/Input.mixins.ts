import { theme, themeUtils } from '@island.is/island-ui/theme'

const inputPadding = `0 ${theme.spacing[2]}px`
const mobileInputPadding = `0 ${theme.spacing[1]}px`
const labelFontSize = 14
const mobileLabelFontSize = 12
const inputFontSize = 24
const mobileInputFontSize = 20
const inputFontSizeSmall = 18
const mobileInputFontSizeSmall = 16
const inputBorderRadius = 8

export const label = {
  display: 'block',
  width: '100%',
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
  fontSize: mobileLabelFontSize,
  lineHeight: 1.3333333333,
  transition: 'color 0.1s',
  ...themeUtils.responsiveStyle({
    md: {
      lineHeight: 1.1428571429,
      fontSize: labelFontSize,
    },
  }),
}

export const labelSizes = {
  xs: {
    marginBottom: 7,
    ...themeUtils.responsiveStyle({
      md: {
        marginBottom: 7,
      },
    }),
  },
  sm: {
    marginBottom: 4,
    ...themeUtils.responsiveStyle({
      md: {
        marginBottom: 4,
      },
    }),
  },
  md: {
    marginBottom: 6,
    ...themeUtils.responsiveStyle({
      md: {
        marginBottom: 8,
      },
    }),
  },
}

export const container = {
  backgroundColor: theme.color.white,
  width: '100%',
  boxShadow: `inset 0 0 0 1px ${theme.color.blue200}`,
  borderRadius: inputBorderRadius,
  cursor: 'text',
  transition: 'box-shadow 0.3s',
}

export const containerSizes = {
  xs: {
    padding: 8,
    ...themeUtils.responsiveStyle({
      md: {
        padding: '10px 16px 10px 10px',
      },
    }),
  },
  sm: {
    padding: 8,
    ...themeUtils.responsiveStyle({
      md: {
        padding: '8px 16px 8px 8px',
      },
    }),
  },
  md: {
    padding: '8px 16px 16px 8px',
    ...themeUtils.responsiveStyle({
      md: {
        padding: '8px 24px 14px 8px',
      },
    }),
  },
}

export const input = {
  caretColor: theme.color.blue400,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.medium,
  border: 'none',
  width: '100%',
  background: 'none',
  boxShadow: 'none',
  appearance: 'none' as const,
  padding: mobileInputPadding,
  ...themeUtils.responsiveStyle({
    md: {
      padding: inputPadding,
    },
  }),
}

export const inputExtraSmallPlaceholder = {
  color: theme.color.dark300,
  fontWeight: theme.typography.light,
  fontSize: theme.typography.baseFontSize,
}

export const inputSizes = {
  xs: {
    fontSize: mobileInputFontSizeSmall,
    lineHeight: 1.25,
    '::placeholder': inputExtraSmallPlaceholder,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: inputFontSizeSmall,
        lineHeight: 1.555556,
      },
    }),
  },
  sm: {
    fontSize: mobileInputFontSizeSmall,
    lineHeight: 1.25,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: inputFontSizeSmall,
        lineHeight: 1.555556,
      },
    }),
  },
  md: {
    fontSize: mobileInputFontSize,
    lineHeight: 1.3,
    padding: inputPadding,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: inputFontSize,
        lineHeight: 1.4166666667,
      },
    }),
  },
}

export const inputPlaceholder = {
  color: theme.color.dark300,
  fontWeight: theme.typography.light,
}

export const placeholder = {
  color: theme.color.dark300,
  fontWeight: theme.typography.light,
  width: '100%',
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

export const inputFocus = {
  outline: 'none',
}

// Hover state
export const containerHover = {
  boxShadow: `inset 0 0 0 1px ${theme.color.blue400}`,
}

// Disabled state
export const labelDisabledEmptyInput = {
  color: theme.color.blue300,
}

// Textarea state
export const textarea = {
  fontSize: 16,
  fontWeight: theme.typography.light,
  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 18,
    },
  }),
}
