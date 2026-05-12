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

globalStyle('.tox.tox-tinymce-aux .tox-tooltip', {
  display: 'none',
})

globalStyle('.tox.tox-tinymce-aux .tox-swatch', {
  cursor: 'pointer',
  transition: 'none',
})

globalStyle(
  '.tox.tox-tinymce-aux .tox-swatch:focus, .tox.tox-tinymce-aux .tox-swatch:hover',
  {
    transform: 'none',
    boxShadow: 'none',
  },
)

globalStyle(`${wrapper} .tox .tox-tbtn`, {
  color: theme.color.dark400,
})

globalStyle(`${wrapper} .tox .tox-tbtn__select-chevron`, {
  display: 'none',
})

globalStyle(`${wrapper} .tox .tox-tbtn:hover`, {
  background: theme.color.blue100,
  color: theme.color.blue400,
})

globalStyle(`${wrapper} .tox .tox-tbtn:focus-visible`, {
  background: theme.color.mint200,
  boxShadow: `0 0 0 2px ${theme.color.mint400}`,
})

globalStyle(
  `${wrapper} .tox .tox-tbtn--enabled, ${wrapper} .tox .tox-tbtn--enabled:hover`,
  {
    background: theme.color.blue200,
    color: theme.color.blue400,
  },
)

globalStyle(`${wrapper} .tox .tox-tbtn:active`, {
  background: theme.color.blue200,
  color: theme.color.blue400,
})

export const colorPicker = style({
  position: 'fixed',
  zIndex: 9999,
  background: 'white',
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: 8,
  padding: 8,
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 6,
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
})

export const colorSwatch = style({
  width: 24,
  height: 24,
  border: `1px solid rgba(0,0,0,0.12)`,
  borderRadius: 4,
  cursor: 'pointer',
  padding: 0,
  ':hover': {
    border: `2px solid ${theme.color.blue300}`,
  },
})

export const colorSwatchSelected = style({
  border: `2px solid ${theme.color.blue300}`,
})

export const removeColor = style({
  width: 24,
  height: 24,
  border: `1px solid rgba(0,0,0,0.12)`,
  borderRadius: 4,
  cursor: 'pointer',
  background: 'transparent',
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.color.dark400,
  ':hover': {
    background: theme.color.blue100,
  },
})
