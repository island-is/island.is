import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const label = style({
  display: 'block',
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
  fontSize: 12,
  lineHeight: 1.3333333333,
  padding: `${theme.spacing[1]}px ${theme.spacing[2]}px 0 ${theme.spacing[1]}px`,
  transition: 'color 0.1s',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      fontSize: 14,
      lineHeight: 1.1428571429,
      padding: `${theme.spacing[1]}px ${theme.spacing[3]}px 0 ${theme.spacing[1]}px`,
    },
  },
})

export const labelError = style({
  color: theme.color.red600,
})

export const labelDisabled = style({
  color: theme.color.blue300,
})

export const wrapper = style({
  position: 'relative',
  borderRadius: theme.border.radius.large,
  overflow: 'hidden',

  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    transition: 'box-shadow 0.2s',
    boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.blue200}`,
  },

  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.blue400}`,
    },
  },
})

export const wrapperDisabled = style({
  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.blue200}`,
    },
  },
})

export const wrapperFocused = style({
  '::before': {
    boxShadow: `inset 0 0 0 ${theme.border.width.xl}px ${theme.color.mint400}`,
  },
  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 ${theme.border.width.xl}px ${theme.color.mint400}`,
    },
  },
})

export const wrapperError = style({
  '::before': {
    boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.red600}`,
  },
  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.red600}`,
    },
  },
})

export const colorPicker = style({
  position: 'fixed',
  zIndex: 9999,
  background: 'white',
  border: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  padding: theme.spacing[1],
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 6,
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
})

export const colorSwatch = style({
  width: 24,
  height: 24,
  border: `1px solid rgba(0,0,0,0.12)`,
  borderRadius: theme.border.radius.standard,
  cursor: 'pointer',
  padding: 0,
  ':hover': {
    border: `${theme.border.width.large}px solid ${theme.color.blue300}`,
  },
})

export const colorSwatchSelected = style({
  border: `${theme.border.width.large}px solid ${theme.color.blue300}`,
})

export const removeColor = style({
  width: 24,
  height: 24,
  border: `1px solid rgba(0,0,0,0.12)`,
  borderRadius: theme.border.radius.standard,
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
  boxShadow: `0 0 0 ${theme.border.width.large}px ${theme.color.mint400}`,
})

globalStyle(
  `${wrapper} .tox .tox-tbtn--enabled, ${wrapper} .tox .tox-tbtn--enabled:hover`,
  {
    background: theme.color.blue200,
    color: theme.color.blue400,
  },
)

globalStyle(`${wrapper} .tox-tinymce--disabled .tox-toolbar-overlord`, {
  display: 'none',
})

globalStyle(`${wrapper} .tox-tinymce--disabled .tox-edit-area`, {
  position: 'relative',
})

globalStyle(`${wrapper} .tox-tinymce--disabled .tox-edit-area::after`, {
  content: '""',
  position: 'absolute',
  inset: 0,
  backgroundColor: theme.color.blue100,
  opacity: 0.35,
  pointerEvents: 'none',
  zIndex: 1,
})

globalStyle(`${wrapper} .tox .tox-tbtn:active`, {
  background: theme.color.blue200,
  color: theme.color.blue400,
})
