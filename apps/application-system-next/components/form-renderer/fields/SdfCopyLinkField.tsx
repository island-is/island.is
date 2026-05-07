import { Box, Button, Text } from '@island.is/island-ui/core'
import { SDF_FIELD_BLOCK_MARGIN_BOTTOM } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfCopyLinkField = ({ component }: FieldRendererProps) => (
  <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
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
