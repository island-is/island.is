import { Box, Divider } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfDividerField = ({ component }: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
    <Divider />
  </Box>
)
