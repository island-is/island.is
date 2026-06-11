import { Box, LinkV2, Text } from '@island.is/island-ui/core'
import { SDF_FIELD_BLOCK_MARGIN_BOTTOM } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfPdfLinkButtonField = ({ component }: FieldRendererProps) => (
  <Box marginBottom={SDF_FIELD_BLOCK_MARGIN_BOTTOM}>
    <Text variant="small" marginBottom={1}>
      {component.pdfDescription}
    </Text>
    <LinkV2 href={component.pdfLinkUrl ?? '#'}>{component.pdfLinkTitle}</LinkV2>
  </Box>
)
