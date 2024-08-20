import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const editCaseFileInputContainer = style({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  marginRight: theme.spacing[2],
})

export const caseFileWrapper = style({
  display: 'flex',
  alignItems: 'center',
  background: theme.color.blue100,
  paddingRight: `${theme.spacing[2]}px`,
})

export const editCaseFileName = style({
  flex: 2,
  marginRight: theme.spacing[1],
})

export const editCaseFileDisplayDate = style({
  flex: 1,
})

export const editCaseFileButton = style({
  width: '32px',
  height: '34px',
  padding: '4px',
  borderRadius: theme.border.radius.large,
  transition: 'background-color 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue200,
    },
  },
})
