import { Box, Divider } from '@island.is/island-ui/core'
import { fieldPreviewLayoutProps } from '../../utils/translationWorkspaceStaticText'
import type { ScreenIntrospection } from '../../types/translationWorkspace'

export const DividerFieldPreview = ({
  screen,
}: {
  screen: ScreenIntrospection
}) => (
  <Box {...fieldPreviewLayoutProps(screen)}>
    <Divider />
  </Box>
)
