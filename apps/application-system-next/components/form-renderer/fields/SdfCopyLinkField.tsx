import { Box, Button, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfCopyLinkField = ({ component }: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
    {component.copyLinkTitle && (
      <Text variant="h5" marginBottom={1}>
        {component.copyLinkTitle}
      </Text>
    )}
    <Text>{component.copyLinkText}</Text>
    {component.copyButtonTitle && (
      <Box marginTop={2}>
        <Button size="small">{component.copyButtonTitle}</Button>
      </Box>
    )}
  </Box>
)
