import { Box } from '@island.is/island-ui/core'
import { fieldPreviewLayoutProps } from '../../utils/translationWorkspaceStaticText'
import type { FieldPreviewBaseProps } from './types'
import { TextDisplayPreviewNodes } from './TextDisplayPreviewNodes'

export const TextDisplayFieldPreview = ({
  screen,
  resolvePreviewString,
}: FieldPreviewBaseProps) => (
  <Box {...fieldPreviewLayoutProps(screen)}>
    <TextDisplayPreviewNodes
      screen={screen}
      resolvePreviewString={resolvePreviewString}
    />
  </Box>
)
