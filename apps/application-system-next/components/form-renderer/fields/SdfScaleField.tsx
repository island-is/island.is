import { Box, Scale } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

/** Mirrors `ScaleFormField` (libs/application/ui-fields) on the island-ui `Scale`. */
export const SdfScaleField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)} width="full">
    <Scale
      id={component.id ?? ''}
      label={component.label}
      min={component.min ?? 0}
      max={component.max ?? 10}
      step={component.step}
      minLabel={component.minLabel}
      maxLabel={component.maxLabel}
      showLabels={component.showLabels ?? true}
      required={component.required}
      disabled={component.disabled}
      error={error}
      value={
        currentValue === undefined || currentValue === null
          ? null
          : String(currentValue)
      }
      onChange={handleChange}
    />
  </Box>
)
