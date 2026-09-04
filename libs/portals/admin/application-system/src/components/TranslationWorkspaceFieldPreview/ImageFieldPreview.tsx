import { Box, Text } from '@island.is/island-ui/core'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { resolveTranslationWorkspaceGraphicsComponent } from '../TranslationWorkspaceGraphicsSvg/TranslationWorkspaceGraphicsSvg'
import * as translationWorkspaceGraphicsSvg from '../TranslationWorkspaceGraphicsSvg/TranslationWorkspaceGraphicsSvg.css'
import {
  previewImageFieldJustifyContent,
  previewImageFieldWidthCss,
  staticTableTitleVariantToText,
} from './translationWorkspaceFieldPreviewUtils'
import type { FieldPreviewBaseProps } from './types'

export const ImageFieldPreview = ({
  screen,
  resolvePreviewString,
}: FieldPreviewBaseProps) => {
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
  const imgWidth = previewImageFieldWidthCss(screen.imageWidth)
  const justify = previewImageFieldJustifyContent(screen.imagePosition)
  const GraphicsSvgComponent = resolveTranslationWorkspaceGraphicsComponent(
    screen.imageSvgComponentName,
  )

  return (
    <Box {...layout}>
      {titleText !== '' && (
        <Box marginBottom={1}>
          <Text variant={titleVariant} as={titleVariant}>
            {titleText}
          </Text>
        </Box>
      )}
      <Box
        display={screen.imagePosition != null ? 'flex' : 'block'}
        justifyContent={justify}
      >
        {screen.imageUrl ? (
          <img
            src={screen.imageUrl}
            alt={screen.imageAlt ?? ''}
            style={{
              width: imgWidth,
              height: 'auto',
              maxWidth: '100%',
              display: 'block',
            }}
          />
        ) : GraphicsSvgComponent ? (
          <Box
            style={{
              width: imgWidth,
              maxWidth: '100%',
            }}
            className={
              imgWidth !== 'auto'
                ? translationWorkspaceGraphicsSvg.svgContained
                : undefined
            }
          >
            <GraphicsSvgComponent />
          </Box>
        ) : screen.imageSvgComponentName ? (
          <Box
            padding={4}
            border="standard"
            borderRadius="standard"
            background="blue100"
            width="full"
          >
            <Text variant="small" color="dark400">
              SVG: {screen.imageSvgComponentName}
            </Text>
          </Box>
        ) : (
          <Text variant="small" color="dark300">
            Image
          </Text>
        )}
      </Box>
    </Box>
  )
}
