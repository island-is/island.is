import { Box, Checkbox, Icon, Text } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import { coreMessages } from '@island.is/application/core'
import { noop } from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import type { PreviewFormatMessage } from '../../types/translationWorkspace'
import type { FieldPreviewBaseProps } from './types'
import { ExternalDataSourcePreview } from './ExternalDataSourcePreview'

export type ExternalDataProviderPreviewProps = FieldPreviewBaseProps & {
  formatMessage: PreviewFormatMessage
}

export const ExternalDataProviderPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
}: ExternalDataProviderPreviewProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const intro = resolveTranslatableStaticText(
    screen.subTitle ?? '',
    screen.messageDescriptors,
    resolvePreviewString,
  )
  const checkboxStatic = screen.checkboxLabel ?? ''
  const checkboxResolved = checkboxStatic
    ? resolveTranslatableStaticText(
        checkboxStatic,
        screen.messageDescriptors,
        resolvePreviewString,
      )
    : formatMessage(coreMessages.externalDataAgreement)

  return (
    <Box {...layout}>
      <Box marginTop={2} marginBottom={5}>
        <Box display="flex" alignItems="center" justifyContent="flexStart">
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">{intro}</Text>
        </Box>
        {screen.description && (
          <Box marginTop={4}>
            <Markdown>
              {resolveTranslatableStaticText(
                screen.description,
                screen.messageDescriptors,
                resolvePreviewString,
              )}
            </Markdown>
          </Box>
        )}
      </Box>
      <Box marginBottom={5}>
        {screen.children
          ?.filter((child) => child.type === 'EXTERNAL_DATA_SOURCE')
          .map((child) => (
            <Box key={child.id}>
              <ExternalDataSourcePreview
                screen={child}
                resolvePreviewString={resolvePreviewString}
              />
            </Box>
          ))}
      </Box>
      <Checkbox
        large
        name={`preview-external-data-${screen.id}`}
        onChange={noop}
        checked={false}
        backgroundColor="blue"
        label={<Markdown>{checkboxResolved}</Markdown>}
      />
      {screen.subDescription && (
        <Box marginTop={4}>
          <Markdown>
            {resolveTranslatableStaticText(
              screen.subDescription,
              screen.messageDescriptors,
              resolvePreviewString,
            )}
          </Markdown>
        </Box>
      )}
    </Box>
  )
}
