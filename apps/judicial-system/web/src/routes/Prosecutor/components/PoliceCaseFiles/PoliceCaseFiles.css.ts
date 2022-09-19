import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const policeCaseFilesContainer = style({
  padding: `${theme.spacing[1]}px ${theme.spacing[4]}px`,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
})

export const policeCaseFile = style({
  marginBottom: theme.spacing[2],
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  backgroundColor: theme.color.blue100,
  borderRadius: theme.border.radius.standard,
})

export const selectAllPoliceCaseFiles = style({
  backgroundColor: theme.color.white,
})

export const uploadToRVGButtonContainer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing[3],
})
