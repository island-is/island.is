import { Box, Input } from '@island.is/island-ui/core'
import { SDF_FIELD_CONTROL_PADDING_TOP } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfBankAccountField = ({
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
        placeholder="0000-00-000000"
        disabled={component.disabled}
        hasError={!!error}
        errorMessage={error}
        value={(currentValue as string) ?? ''}
        onChange={(e) => handleChange(e.target.value)}
      />
    </Box>
  </Box>
)
