import { Box, Text } from '@island.is/island-ui/core'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
} from '../../utils/translationWorkspaceStaticText'
import type { FieldPreviewBaseProps } from './types'

export const PlaceholderFieldPreview = ({
  screen,
  resolvePreviewString,
}: FieldPreviewBaseProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const label = resolvePreviewLabel(screen, resolvePreviewString)

  return (
    <Box
      padding={2}
      border="standard"
      borderRadius="standard"
      background="white"
      {...layout}
    >
      <Text variant="eyebrow" color="dark300">
        {screen.type}
      </Text>
      <Text variant="small">{label}</Text>
    </Box>
  )
}
