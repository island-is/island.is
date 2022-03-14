import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const addCourtDocumentContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr 240px',
  columnGap: theme.spacing[2],
  marginBottom: theme.spacing[3],
})

export const additionalCourtDocumentContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: `1px solid ${theme.color.blue200}`,
  padding: `${theme.spacing[2]}px 0`,
})

export const dropdownContainer = style({
  marginRight: `${theme.spacing[2]}px`,
})

export const control = style({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  boxShadow: 'none',
})

export const option = style({
  cursor: 'pointer',
  position: 'relative',
  padding: `${theme.spacing[1]}px`,

  selectors: {
    '&:hover': {
      background: theme.color.blue100,
    },
  },
})

export const menu = style({
  marginTop: -3,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  boxShadow: 'none',
  borderTop: `none`,
  borderRight: `3px solid ${theme.color.mint400}`,
  borderLeft: `3px solid ${theme.color.mint400}`,
  borderBottom: `3px solid ${theme.color.mint400}`,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  boxSizing: 'border-box',
})

export const menuIsOpen = style({
  boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
})

globalStyle('.court-documents-select__option--is-selected', {
  color: theme.color.dark400,
  background: theme.color.blue100,
})

globalStyle('.court-documents-select__option--is-selected:hover', {
  background: theme.color.blue100,
})

globalStyle('.court-documents-select__option--is-focused', {
  background: theme.color.blue100,
})
