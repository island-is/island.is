import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({}, 'container')

export const addCourtDocumentContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr 208px',
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
  width: '100%',
  maxWidth: '208px',
  marginRight: `${theme.spacing[2]}px`,
})

export const control = style({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  boxShadow: 'none',

  selectors: {
    '&:focus &:hover': {
      borderTop: `3px solid ${theme.color.mint400}`,
      borderRight: `3px solid ${theme.color.mint400}`,
      borderLeft: `3px solid ${theme.color.mint400}`,
      borderBottom: `3px solid ${theme.color.mint400}`,
    },
  },
})

export const menu = style({
  marginTop: -3,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  boxShadow: 'none',
  borderTop: `1px solid ${theme.color.blue200}`,
  borderRight: `3px solid ${theme.color.mint400}`,
  borderLeft: `3px solid ${theme.color.mint400}`,
  borderBottom: `3px solid ${theme.color.mint400}`,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  boxSizing: 'border-box',
})

export const selectContainer = style({
  display: 'none',
})

globalStyle(
  `.CourtDocuments_container__control${container}.CourtDocuments_container__control--menu-is-open`,
  {
    // borderColor: 'transparent',
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
  },
)
