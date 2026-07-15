import { Box, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfUnsupportedField = ({ component }: FieldRendererProps) => (
  <Box
    {...getSdfFieldMargins(component)}
    padding={2}
    background="blue100"
    borderRadius="large"
  >
    <Text variant="small" color="dark300">
      [{component.__typename}] {component.label ?? component.id}
    </Text>
  </Box>
)
