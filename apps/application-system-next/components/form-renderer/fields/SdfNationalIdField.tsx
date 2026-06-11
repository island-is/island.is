import { Box, Input } from '@island.is/island-ui/core'
import { SDF_FIELD_CONTROL_PADDING_TOP } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfNationalIdField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => (
  <Box marginBottom={3}>
    <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
      <Input
        id={component.id ?? ''}
        name={component.id ?? ''}
        label={component.label ?? ''}
        placeholder="000000-0000"
        disabled={component.disabled}
        required={component.required}
        hasError={!!error}
        errorMessage={error}
        value={(currentValue as string) ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        size="xs"
      />
    </Box>
  </Box>
)
