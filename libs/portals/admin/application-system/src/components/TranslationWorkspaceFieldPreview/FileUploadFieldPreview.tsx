import { Box, InputFileUpload } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import { coreDefaultFieldMessages } from '@island.is/application/core'
import { noop } from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import type { PreviewFormatMessage } from '../../types/translationWorkspace'
import type { FieldPreviewBaseProps } from './types'

export type FileUploadFieldPreviewProps = FieldPreviewBaseProps & {
  formatMessage: PreviewFormatMessage
}

export const FileUploadFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
}: FileUploadFieldPreviewProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const label = resolvePreviewLabel(screen, resolvePreviewString)

  const introductionText = screen.fileUploadIntroduction
    ? resolveTranslatableStaticText(
        screen.fileUploadIntroduction,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  const uploadHeader = screen.fileUploadHeader
    ? resolveTranslatableStaticText(
        screen.fileUploadHeader,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : label.trim() ||
      formatMessage(coreDefaultFieldMessages.defaultFileUploadHeader)

  const uploadDescription = screen.fileUploadDescription
    ? resolveTranslatableStaticText(
        screen.fileUploadDescription,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : formatMessage(coreDefaultFieldMessages.defaultFileUploadDescription)

  const uploadButtonLabel = screen.fileUploadButtonLabel
    ? resolveTranslatableStaticText(
        screen.fileUploadButtonLabel,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : formatMessage(coreDefaultFieldMessages.defaultFileUploadButtonLabel)

  return (
    <Box marginTop={3} marginBottom={3} {...layout}>
      {introductionText !== '' && (
        <Box marginBottom={2}>
          <Markdown>{introductionText}</Markdown>
        </Box>
      )}
      <Box paddingTop={2}>
        <InputFileUpload
          name={screen.id}
          files={[]}
          title={uploadHeader || undefined}
          description={uploadDescription || undefined}
          buttonLabel={uploadButtonLabel || undefined}
          onRemove={noop}
        />
      </Box>
    </Box>
  )
}
