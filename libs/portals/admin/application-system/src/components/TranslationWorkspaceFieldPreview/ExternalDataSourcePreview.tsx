import { Box, Text, Icon } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import type { FieldPreviewBaseProps } from './types'

export const ExternalDataSourcePreview = ({
  screen,
  resolvePreviewString,
}: FieldPreviewBaseProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const pageTitleResolved = screen.pageTitle
    ? resolveTranslatableStaticText(
        screen.pageTitle,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''
  const titleResolved = resolveTranslatableStaticText(
    screen.title ?? '',
    screen.messageDescriptors,
    resolvePreviewString,
  )
  const subResolved = resolveTranslatableStaticText(
    screen.description ?? '',
    screen.messageDescriptors,
    resolvePreviewString,
  ).trim()

  return (
    <Box marginBottom={3} {...layout}>
      {pageTitleResolved.length > 0 && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flexStart"
          marginTop={5}
        >
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">{pageTitleResolved}</Text>
        </Box>
      )}
      <Text variant="h4" color="blue400">
        {titleResolved}
      </Text>
      {screen.description && subResolved.length > 0 && (
        <Box component="div" marginTop={1}>
          <Markdown>{subResolved}</Markdown>
        </Box>
      )}
    </Box>
  )
}
