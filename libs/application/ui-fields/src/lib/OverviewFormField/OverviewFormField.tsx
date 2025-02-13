import { formatTextWithLocale } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { ReviewGroup } from '@island.is/application/ui-components'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FileItem } from './FileItem'
import { OverviewField } from '@island.is/application/types'
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
  const tableData = field?.tableData?.(
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
              locale,
              formatMessage,
            )}
          </Text>
        )}
        {field.description && (
          <Text as="p" paddingBottom={3}>
            {formatTextWithLocale(
              field.description,
              application,
              locale,
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
          {items &&
            items?.map((item, i) => {
              if (!item.keyText && !item.valueText) {
                return (
                  <GridColumn span={['12/12', '12/12', '12/12', '12/12']} />
                )
              }
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
                        <Divider weight="black" thickness="thick" />
                      </Box>
                    )}

                    <Text variant="h5">
                      {formatTextWithLocale(
                        item?.keyText ?? '',
                        application,
                        locale,
                        formatMessage,
                      )}
                    </Text>
                    <Text
                      fontWeight={item.boldValueText ? 'semiBold' : 'regular'}
                    >
                      {formatTextWithLocale(
                        item?.valueText ?? '',
                        application,
                        locale,
                        formatMessage,
                      )}
                    </Text>
                  </Box>
                </GridColumn>
              )
            })}
          {attachments && (
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <Box marginTop={8}>
                {attachments?.map((attachment, i) => {
                  return (
                    <GridColumn
                      key={i}
                      span={[
                        '12/12',
                        '12/12',
                        '12/12',
                        attachment.width === 'half' ? '5/12' : '12/12',
                      ]}
                    >
                      <FileItem
                        key={i}
                        fileName={formatTextWithLocale(
                          attachment.fileName,
                          application,
                          locale,
                          formatMessage,
                        )}
                        fileSize={formatTextWithLocale(
                          attachment.fileSize ?? '',
                          application,
                          locale,
                          formatMessage,
                        )}
                        fileType={formatTextWithLocale(
                          attachment.fileType ?? '',
                          application,
                          locale,
                          formatMessage,
                        )}
                      />
                    </GridColumn>
                  )
                })}
              </Box>
            </GridColumn>
          )}
          {tableData && (
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <Box marginTop={10}>
                <Table.Table>
                  <Table.Head>
                    <Table.Row>
                      {tableData.header.map((cell, index) => (
                        <Table.HeadData key={`${cell}-${index}`}>
                          {formatTextWithLocale(
                            cell,
                            application,
                            locale,
                            formatMessage,
                          )}
                        </Table.HeadData>
                      ))}
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {tableData.rows.map((row, rowIndex) => (
                      <Table.Row key={`row-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <Table.Data key={`row-${rowIndex}-cell-${cellIndex}`}>
                            {formatTextWithLocale(
                              cell,
                              application,
                              locale,
                              formatMessage,
                            )}
                          </Table.Data>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Table>
              </Box>
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>
    </Box>
  )
}
