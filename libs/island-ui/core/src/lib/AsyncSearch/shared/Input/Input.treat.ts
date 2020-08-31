import { style, styleMap } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const input = style({
  position: 'relative',
  width: '100%',
  borderRadius: 5,
  background: theme.color.white,
  fontWeight: theme.typography.light,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  padding: '16px 96px 16px 16px',
  borderStyle: 'solid',
  outline: 0,
  transition: 'border-color 150ms ease',
  ':hover': {
    borderColor: theme.color.blue400,
  },
  selectors: {
    [`&:focus:hover`]: {
      borderColor: theme.color.transparent,
    },
  },
})

export const hasLabel = style({
  padding: '16px 46px 0 16px',
})

export const open = style({
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderColor: theme.color.blue200,
  selectors: {
    [`&:focus:hover`]: {
      borderColor: theme.color.blue200,
    },
  },
})

export const colored = style({
  background: theme.color.blue100,
  borderColor: theme.color.blue200,
  selectors: {
    [`&:focus:hover`]: {
      borderColor: theme.color.blue200,
    },
  },
})

export const sizes = styleMap({
  medium: {
    height: 40,
    fontSize: 15,
    ...themeUtils.responsiveStyle({
      md: {
        height: 48,
        fontSize: 18,
      },
    }),
  },
  large: {
    height: 72,
    fontSize: 20,
    ...themeUtils.responsiveStyle({
      md: {
        height: 80,
        fontSize: 24,
      },
    }),
  },
})

export const white = style({
  backgroundColor: theme.color.transparent,
  color: theme.color.white,
  '::placeholder': {
    color: theme.color.white,
  },
  ':focus': {
    backgroundColor: theme.color.transparent,
    color: theme.color.white,
  },
  ':hover': {
    borderColor: theme.color.white,
  },
  selectors: {
    [`&:focus:hover`]: {
      backgroundColor: theme.color.transparent,
    },
  },
})

export const purpleBackground = style({
  borderColor: 'rgba(195, 171, 217, 0.6)',
})
