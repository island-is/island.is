import { Box, Text } from '@island.is/island-ui/core'
import type { FieldRendererProps } from '../types'

export const SdfKeyValueField = ({ component }: FieldRendererProps) => (
  <Box
    marginBottom={2}
    display="flex"
    justifyContent="spaceBetween"
    paddingY={2}
    borderBottomWidth="standard"
    borderColor="blue200"
  >
    <Text fontWeight="semiBold">{component.label}</Text>
    <Text>{component.value}</Text>
  </Box>
)
