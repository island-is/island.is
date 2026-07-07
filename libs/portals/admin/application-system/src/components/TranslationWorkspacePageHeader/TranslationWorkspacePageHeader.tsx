import { Box } from '@island.is/island-ui/core'
import {
  TranslationWorkspaceHeaderBackButton,
  TranslationWorkspaceHeaderLanguageTabs,
  TranslationWorkspaceHeaderSaveButton,
  TranslationWorkspaceHeaderPublishButton,
  TranslationWorkspaceHeaderValidationToggle,
} from '../../context/TranslationWorkspaceHeaderBridge'

export const TranslationWorkspacePageHeader = () => (
  <Box
    display={['flex', 'flex', 'none']}
    justifyContent="spaceBetween"
    alignItems="center"
    columnGap={2}
  >
    <TranslationWorkspaceHeaderBackButton />
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
