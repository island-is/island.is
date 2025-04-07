import { formatTextWithLocale } from '@island.is/application/core'
import { FieldBaseProps, OverviewField } from '@island.is/application/types'
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
    <Box
      paddingTop={field.marginTop ? field.marginTop : 3}
      paddingBottom={field.marginBottom ? field.marginBottom : 3}
    >
      <ReviewGroup
        isLast={!field.bottomLine}
        editAction={() =>
          changeScreens(
            typeof field.backId === 'function'
              ? field.backId(application.answers) ?? ''
              : field.backId ?? '',
          )
        }
        isEditable={field.backId !== undefined}
      >
        <Box marginRight={12}>
          {field.title && (
            <Text
              variant={field.titleVariant ? field.titleVariant : 'h4'}
              as={field.titleVariant ? field.titleVariant : 'h4'}
              paddingTop={2}
              paddingBottom={field.description ? 2 : 5}
            >
              {formatTextWithLocale(
                field.title,
                application,
                locale,
                formatMessage,
              )}
            </Text>
          )}
          {field.description && (
            <Text as="p" paddingTop={0} paddingBottom={2}>
              {formatTextWithLocale(
                field.description,
                application,
                locale,
                formatMessage,
              )}
            </Text>
          )}
        </Box>
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
                      ? field.title || field.description
                        ? ['12/12', '12/12', '12/12', '12/12']
                        : ['10/12', '10/12', '10/12', '10/12']
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
                    {Array.isArray(item?.valueText) ? (
                      item?.valueText.map((value, index) => (
                        <Text
                          key={`${value}-${index}`}
                          fontWeight={
                            item.boldValueText ? 'semiBold' : 'regular'
                          }
                        >
                          {formatTextWithLocale(
                            value,
                            application,
                            locale,
                            formatMessage,
                          )}
                        </Text>
                      ))
                    ) : (
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
                    )}
                  </Box>
                </GridColumn>
              )
            })}
          {attachments &&
            attachments?.map((attachment, i) => {
              return (
                <GridColumn
                  key={i}
                  span={[
                    '12/12',
                    '12/12',
                    '12/12',
                    attachment.width === 'half' ? '6/12' : '12/12',
                  ]}
                >
                  <Box
                    marginTop={
                      !field.description && !field.title && i === 0 ? 8 : 0
                    }
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
                  </Box>
                </GridColumn>
              )
            })}
          {tableData && (
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <Box marginTop={field.description || field.title ? 0 : 10}>
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
