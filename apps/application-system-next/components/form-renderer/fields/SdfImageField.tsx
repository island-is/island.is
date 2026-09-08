import { Box, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfImageField = ({ component }: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
    <Text fontWeight="semiBold" marginBottom={1}>
      {component.label}
    </Text>
    {component.imageUrl && (
      <Box borderRadius="large" overflow="hidden">
        <img
          src={component.imageUrl}
          alt={component.label ?? ''}
          style={{ maxWidth: '100%', display: 'block' }}
        />
      </Box>
    )}
  </Box>
)
