import { Box, Text } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import {
  fieldPreviewLayoutProps,
  isMarkdownMessageId,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { descriptionTitleVariantToText } from './translationWorkspaceFieldPreviewUtils'
import type { FieldPreviewBaseProps } from './types'

export const DescriptionFieldPreview = ({
  screen,
  resolvePreviewString,
}: FieldPreviewBaseProps) => {
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)
  const titleText =
    screen.title != null && screen.title !== ''
      ? resolveTranslatableStaticText(
          screen.title,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : ''
  const descriptionResolved = screen.description
    ? resolveTranslatableStaticText(
        screen.description,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  const titleDescriptor = screen.title
    ? screen.messageDescriptors.find((d) => d.defaultMessage === screen.title)
    : undefined
  const descriptionDescriptor = screen.description
    ? screen.messageDescriptors.find(
        (d) => d.defaultMessage === screen.description,
      )
    : undefined
  const skipIds = new Set(
    [titleDescriptor?.id, descriptionDescriptor?.id].filter(
      Boolean,
    ) as string[],
  )
  const extraDescriptors = screen.messageDescriptors.filter(
    (d) => !skipIds.has(d.id),
  )

  const titleV = descriptionTitleVariantToText(screen.titleVariant)

  return (
    <Box key={key} {...layout}>
      {titleText !== '' && (
        <Text
          variant={titleV}
          as={titleV}
          marginBottom={descriptionResolved ? 1 : 0}
        >
          {titleText}
        </Text>
      )}
      {descriptionResolved !== '' && (
        <Box component="div">
          <Markdown>{descriptionResolved}</Markdown>
        </Box>
      )}
      {extraDescriptors.length > 0 && (
        <Box marginTop={titleText || descriptionResolved ? 2 : 0}>
          {extraDescriptors.map((d, i) => {
            const text = resolvePreviewString(d.id, d.defaultMessage).trim()
            if (!text) return null
            return isMarkdownMessageId(d.id) ? (
              <Box key={d.id} marginTop={i > 0 ? 2 : 0}>
                <Markdown>{text}</Markdown>
              </Box>
            ) : (
              <Text
                key={d.id}
                as="div"
                whiteSpace="preLine"
                marginTop={i > 0 ? 2 : 0}
              >
                {text}
              </Text>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
