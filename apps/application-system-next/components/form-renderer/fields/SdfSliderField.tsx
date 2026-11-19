import { Box, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfSliderField = ({
  component,
  currentValue,
  handleChange,
}: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
    <Text variant="h5" marginBottom={1}>
      {component.label}
    </Text>
    <input
      id={component.id}
      type="range"
      min={component.min}
      max={component.max}
      step={component.step ?? 1}
      defaultValue={(currentValue as string) ?? String(component.min ?? 0)}
      onChange={(e) => handleChange(Number(e.target.value))}
      style={{ width: '100%' }}
    />
    <Box display="flex" justifyContent="spaceBetween">
      <Text variant="small" color="dark300">
        {component.min}
      </Text>
      <Text variant="small" color="dark300">
        {String(currentValue ?? component.min ?? 0)}
      </Text>
      <Text variant="small" color="dark300">
        {component.max}
      </Text>
    </Box>
  </Box>
)
