import { Box, DatePicker } from '@island.is/island-ui/core'
import {
  SDF_FIELD_CONTROL_PADDING_TOP,
  getSdfFieldMargins,
} from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfDateField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
    <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
      <DatePicker
        id={component.id ?? ''}
        label={component.label ?? ''}
        placeholderText={component.placeholder}
        disabled={component.disabled}
        minDate={component.minDate ? new Date(component.minDate) : undefined}
        maxDate={component.maxDate ? new Date(component.maxDate) : undefined}
        required={component.required}
        hasError={!!error}
        errorMessage={error}
        selected={currentValue ? new Date(currentValue as string) : undefined}
        handleChange={(date) => handleChange(date.toISOString().split('T')[0])}
        size="md"
      />
    </Box>
  </Box>
)
