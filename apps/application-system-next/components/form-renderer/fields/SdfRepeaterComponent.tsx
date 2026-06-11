import { Box, Text } from '@island.is/island-ui/core'
import type { FieldRendererProps } from '../types'

export const SdfRepeaterComponent = ({ component }: FieldRendererProps) => (
  <Box marginBottom={3} border="standard" borderRadius="large" padding={3}>
    <Text fontWeight="semiBold" marginBottom={2}>
      {component.addItemLabel ?? 'Items'}
    </Text>
    <Text variant="small" color="dark300">
      Repeater rendering handled by the backend. Items are re-evaluated on
      REFETCH.
    </Text>
  </Box>
)
