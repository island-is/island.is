import { Box, DatePicker } from '@island.is/island-ui/core'
import { parseDateAnswer, toDateAnswer } from '../../../lib/dateAnswer'
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
        minDate={parseDateAnswer(component.minDate)}
        maxDate={parseDateAnswer(component.maxDate)}
        required={component.required}
        hasError={!!error}
        errorMessage={error}
        selected={parseDateAnswer(currentValue)}
        handleChange={(date) => {
          const answer = toDateAnswer(date)
          if (answer !== undefined) handleChange(answer)
        }}
        size="md"
      />
    </Box>
  </Box>
)
