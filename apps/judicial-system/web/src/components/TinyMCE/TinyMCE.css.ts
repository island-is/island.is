import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const label = style({
  display: 'block',
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
  fontSize: 12,
  lineHeight: 1.3333333333,
  padding: `8px ${theme.spacing[2]}px 0 ${theme.spacing[1]}px`,
  transition: 'color 0.1s',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 14,
      lineHeight: 1.1428571429,
      padding: '8px 24px 0 8px',
    },
  },
})

export const wrapper = style({
  position: 'relative',
  borderRadius: 8,
  overflow: 'hidden',

  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    transition: 'box-shadow 0.2s',
    boxShadow: `inset 0 0 0 1px ${theme.color.blue200}`,
  },

  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 1px ${theme.color.blue400}`,
    },
    '&:focus-within::before': {
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
  },
})

globalStyle(`${wrapper} .tox-tinymce, ${wrapper} .tox-tinymce--focus`, {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
})

globalStyle(`${wrapper} .tox .tox-edit-area::before`, {
  border: 'none',
})
