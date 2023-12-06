import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const valueWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  borderTop: `1px solid ${theme.color.blue200}`,
  padding: `${theme.spacing[2]}px 0`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      alignItems: 'center',
    },
  },
})

export const courtDocumentInfo = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      flexDirection: 'row',
    },
  },
})

export const nameContainer = style({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  minHeight: '34px',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minHeight: 'auto',
    },
  },
})

export const dropdownContainer = style({
  display: 'flex',
  alignItems: 'center',
  minWidth: theme.spacing[28],
  marginTop: theme.spacing[2],
  marginBottom: theme.spacing[1],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      marginRight: theme.spacing[2],
      marginLeft: theme.spacing[2],
      marginTop: theme.spacing[0],
      marginBottom: theme.spacing[0],
    },
  },
})

export const firstCourtDocument = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
  },
})

export const removeButton = style({
  background: theme.color.blue200,
  padding: theme.spacing[1],
  borderRadius: '8px',
  width: '34px',
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
