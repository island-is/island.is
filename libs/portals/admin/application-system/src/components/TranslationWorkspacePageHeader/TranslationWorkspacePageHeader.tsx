import { Box } from '@island.is/island-ui/core'
import {
  TranslationWorkspaceHeaderLanguageTabs,
  TranslationWorkspaceHeaderSaveButton,
  TranslationWorkspaceHeaderPublishButton,
  TranslationWorkspaceHeaderValidationToggle,
} from '../../context/TranslationWorkspaceHeaderBridge'

export const TranslationWorkspacePageHeader = () => (
  <Box
    display={['flex', 'flex', 'none']}
    justifyContent="flexEnd"
    columnGap={2}
  >
    <Box
      display="flex"
      justifyContent="flexEnd"
      alignItems="center"
      columnGap={2}
    >
      <TranslationWorkspaceHeaderValidationToggle />
      <TranslationWorkspaceHeaderSaveButton />
      <TranslationWorkspaceHeaderPublishButton />
      <TranslationWorkspaceHeaderLanguageTabs />
    </Box>
  </Box>
)
