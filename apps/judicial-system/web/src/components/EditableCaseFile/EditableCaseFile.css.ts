import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const caseFileWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'stretch',
  paddingRight: `${theme.spacing[2]}px`,
  paddingTop: `${theme.spacing[1]}px`,
  paddingBottom: `${theme.spacing[1]}px`,
  minHeight: '64px',
  borderRadius: theme.border.radius.default,
  border: '1px solid',
  transition: 'background-color 0.2s ease-in-out',
})

export const caseFileWrapperStates = styleVariants({
  error: {
    background: theme.color.red100,
    borderColor: 'transparent',
  },
  done: {
    background: theme.color.blue100,
    borderColor: 'transparent',
  },
  uploading: {
    background: 'transparent',
    borderColor: theme.color.blue200,
  },
})

export const editCaseFileInputContainer = style({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  marginRight: theme.spacing[2],
})

export const editCaseFileName = style({
  flex: 2,
  marginRight: theme.spacing[1],
})

export const editCaseFileDisplayDate = style({
  flex: 1,
})

export const editCaseFileButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '34px',
  padding: '4px',
  borderRadius: theme.border.radius.default,
  transition: 'background-color 0.2s ease-in-out',
  cursor: 'default',
})

export const background = styleVariants({
  primary: {
    selectors: {
      '&:hover': {
        backgroundColor: theme.color.blue200,
        cursor: 'pointer',
      },
    },
  },
  secondary: {
    selectors: {
      '&:hover': {
        backgroundColor: theme.color.red200,
        cursor: 'pointer',
      },
    },
  },
})
