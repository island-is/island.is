import { AlertMessage, Box } from '@island.is/island-ui/core'
import type { FieldRendererProps } from '../types'

export const SdfAlertMessageField = ({ component }: FieldRendererProps) => (
  <Box marginBottom={3}>
    <AlertMessage
      type={
        (component.alertType as 'info' | 'error' | 'warning' | 'success') ??
        'info'
      }
      title={component.title ?? ''}
      message={component.message}
    />
  </Box>
)
