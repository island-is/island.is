import { Box, Input } from '@island.is/island-ui/core'
import { SDF_FIELD_CONTROL_PADDING_TOP } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfFileUploadField = ({
  component,
  error,
}: FieldRendererProps) => (
  <Box marginBottom={3}>
    <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
      <Input
        id={component.id ?? ''}
        name={component.id ?? ''}
        label={component.label ?? ''}
        disabled={component.disabled}
        required={component.required}
        hasError={!!error}
        errorMessage={error}
        type={'file' as 'text'}
      />
    </Box>
  </Box>
)
