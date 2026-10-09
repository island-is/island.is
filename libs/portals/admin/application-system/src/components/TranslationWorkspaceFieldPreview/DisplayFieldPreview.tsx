import { Box, Input, Text } from '@island.is/island-ui/core'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { staticTableTitleVariantToText } from './translationWorkspaceFieldPreviewUtils'
import type { FieldPreviewBaseProps } from './types'

export type DisplayFieldPreviewProps = FieldPreviewBaseProps & {
  previewValue?: string
  errorMessage?: string
}

export const DisplayFieldPreview = ({
  screen,
  resolvePreviewString,
  previewValue,
  errorMessage,
}: DisplayFieldPreviewProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const titleVariant = staticTableTitleVariantToText(screen.titleVariant)
  const titleText =
    screen.title != null && screen.title !== ''
      ? resolveTranslatableStaticText(
          screen.title,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : ''
  const labelDefault = screen.displayLabelMessageId
    ? screen.messageDescriptors.find(
        (descriptor) => descriptor.id === screen.displayLabelMessageId,
      )?.defaultMessage
    : undefined
  const suffixDefault = screen.displaySuffixMessageId
    ? screen.messageDescriptors.find(
        (descriptor) => descriptor.id === screen.displaySuffixMessageId,
      )?.defaultMessage
    : undefined
  const inputLabel =
    screen.displayLabelMessageId != null
      ? resolvePreviewString(screen.displayLabelMessageId, labelDefault).trim()
      : screen.displayLabelStatic ?? ''
  const suffixText =
    screen.displaySuffixMessageId != null
      ? resolvePreviewString(
          screen.displaySuffixMessageId,
          suffixDefault,
        ).trim()
      : (screen.displaySuffixStatic ?? '').trim()
  const stubValue = previewValue ?? '—'

  return (
    <Box {...layout}>
      <Box paddingY={3} display="flex" flexDirection="column">
        <Box width="full">
          {titleText !== '' && (
            <Text variant={titleVariant} as={titleVariant} paddingBottom={1}>
              {titleText}
            </Text>
          )}
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flexEnd"
            columnGap={2}
          >
            <Box flexGrow={1}>
              <Input
                id={screen.id}
                name={screen.id}
                label={inputLabel || undefined}
                readOnly
                value={stubValue}
                hasError={!!errorMessage}
                errorMessage={errorMessage}
                backgroundColor="blue"
              />
            </Box>
            {suffixText !== '' && (
              <Text variant="small" paddingBottom={2}>
                {suffixText}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
