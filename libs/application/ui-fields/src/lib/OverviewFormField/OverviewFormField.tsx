import { formatTextWithLocale } from '@island.is/application/core'
import { FieldBaseProps, OverviewField } from '@island.is/application/types'
import { ReviewGroup } from '@island.is/application/ui-components'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { FileItem } from './FileItem'

interface Props extends FieldBaseProps {
  field: OverviewField
}

export const OverviewFormField = ({
  field,
  application,
  goToScreen,
}: Props) => {
  const items = field?.items?.(application.answers, application.externalData)
  const attachments = field?.attachments?.(
    application.answers,
    application.externalData,
  )
  const { formatMessage, lang: locale } = useLocale()
  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }
  return (
    <Box>
      <Box>
        {field.title && (
          <Text variant="h4" as="h4" paddingTop={5} paddingBottom={3}>
            {formatTextWithLocale(
              field.title,
              application,
              locale as Locale,
              formatMessage,
            )}
          </Text>
        )}
        {field.description && (
          <Text as="p" paddingBottom={3}>
            {formatTextWithLocale(
              field.description,
              application,
              locale as Locale,
              formatMessage,
            )}
          </Text>
        )}
      </Box>
      <ReviewGroup
        isLast={!field.bottomLine}
        editAction={() => changeScreens(field.backId ?? '')}
      >
        <GridRow>
          {items?.map((item, i) => {
            if (!item.keyText && !item.valueText)
              return <GridColumn span={['12/12', '12/12', '12/12', '12/12']} />
            return (
              <GridColumn
                key={i}
                span={
                  item.width === 'full'
                    ? ['12/12', '12/12', '12/12', '12/12']
                    : item.width === 'half'
                    ? ['9/12', '9/12', '9/12', '5/12']
                    : undefined
                }
              >
                <Box paddingBottom={3}>
                  {item.lineAboveKeyText && (
                    <Box paddingBottom={2}>
                      <Divider weight="thick" />
                    </Box>
                  )}

                  <Text variant="h5">
                    {formatTextWithLocale(
                      item?.keyText ?? '',
                      application,
                      locale as Locale,
                      formatMessage,
                    )}
                  </Text>
                  <Text
                    fontWeight={item.boldValueText ? 'semiBold' : 'regular'}
                  >
                    {formatTextWithLocale(
                      item?.valueText ?? '',
                      application,
                      locale as Locale,
                      formatMessage,
                    )}
                  </Text>
                </Box>
              </GridColumn>
            )
          })}
          {attachments?.map((attachment, i) => {
            return (
              <GridColumn
                key={i}
                span={
                  attachment.width === 'half'
                    ? ['9/12', '9/12', '9/12', '5/12']
                    : ['9/12', '9/12', '9/12', '10/12']
                }
              >
                <FileItem
                  key={i}
                  fileName={formatTextWithLocale(
                    attachment.fileName,
                    application,
                    locale as Locale,
                    formatMessage,
                  )}
                  fileSize={formatTextWithLocale(
                    attachment.fileSize ?? '',
                    application,
                    locale as Locale,
                    formatMessage,
                  )}
                  fileType={formatTextWithLocale(
                    attachment.fileType ?? '',
                    application,
                    locale as Locale,
                    formatMessage,
                  )}
                />
              </GridColumn>
            )
          })}
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
