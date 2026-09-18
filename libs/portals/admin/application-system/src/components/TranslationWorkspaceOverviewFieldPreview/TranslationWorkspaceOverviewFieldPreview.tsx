import type { BoxProps } from '@island.is/island-ui/core/types'
import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import { Markdown } from '@island.is/shared/components'
import type {
  PreviewFormatMessage,
  ResolvePreviewString,
  ScreenIntrospection,
} from '../../types/translationWorkspace'
import { m } from '../../lib/messages'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'

const overviewDescriptorsForPreviewRows = (
  screen: ScreenIntrospection,
): ScreenIntrospection['messageDescriptors'] => {
  const descriptors = screen.messageDescriptors ?? []
  const titleDescriptor = screen.title
    ? descriptors.find((d) => d.defaultMessage === screen.title) ?? null
    : null
  const descDescriptor = screen.description
    ? descriptors.find((d) => d.defaultMessage === screen.description) ?? null
    : null
  const usedIds = new Set(
    [titleDescriptor?.id, descDescriptor?.id].filter(Boolean) as string[],
  )
  return descriptors.filter((d) => !usedIds.has(d.id))
}

export interface TranslationWorkspaceOverviewFieldPreviewProps {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
  formatMessage: PreviewFormatMessage
}

/**
 * Summary-style preview for `OVERVIEW` fields: matches production `ReviewGroup` shell.
 * Row copy appears when introspection can collect message descriptors from `items()`;
 * otherwise shows layout stubs and a short explanation.
 */
export const TranslationWorkspaceOverviewFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
}: TranslationWorkspaceOverviewFieldPreviewProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const layoutBoxProps: Pick<
    BoxProps,
    'marginTop' | 'marginBottom' | 'paddingTop'
  > = layout

  const titleText =
    screen.title != null && screen.title !== ''
      ? resolveTranslatableStaticText(
          screen.title,
          screen.messageDescriptors ?? [],
          resolvePreviewString,
        )
      : ''

  const descriptionMarkdown =
    screen.description != null && screen.description !== ''
      ? resolveTranslatableStaticText(
          screen.description,
          screen.messageDescriptors ?? [],
          resolvePreviewString,
        )
      : ''

  const rowDescriptors = overviewDescriptorsForPreviewRows(screen)

  return (
    <Box key={screen.id} {...layoutBoxProps}>
      <ReviewGroup isEditable={false} isLast={true}>
        <Box marginRight={12}>
          {titleText !== '' && (
            <Text
              variant="h3"
              as="h3"
              paddingTop={2}
              paddingBottom={descriptionMarkdown !== '' ? 2 : 5}
            >
              {titleText}
            </Text>
          )}
          {descriptionMarkdown !== '' && (
            <Box paddingTop={0} paddingBottom={2} component="div">
              <Markdown>{descriptionMarkdown}</Markdown>
            </Box>
          )}
        </Box>
        {rowDescriptors.length > 0 ? (
          <Stack space={2}>
            {rowDescriptors.map((d) => (
              <Text key={d.id} variant="small">
                {resolvePreviewString(d.id, d.defaultMessage)}
              </Text>
            ))}
          </Stack>
        ) : (
          <Stack space={2}>
            <Text variant="small" color="dark300">
              {formatMessage(m.translationWorkspaceOverviewPreviewHint)}
            </Text>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <Text variant="small" color="dark300">
                  {formatMessage(m.translationWorkspaceOverviewPreviewStubKey)}
                </Text>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
                <Text variant="small" color="dark300">
                  {formatMessage(
                    m.translationWorkspaceOverviewPreviewStubValue,
                  )}
                </Text>
              </GridColumn>
            </GridRow>
          </Stack>
        )}
      </ReviewGroup>
    </Box>
  )
}
