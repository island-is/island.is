import { useApolloClient } from '@apollo/client/react'
import {
  coreErrorMessages,
  formatTextWithLocale,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  KeyValueItem,
  OverviewField,
  TableData,
} from '@island.is/application/types'
import { ReviewGroup } from '@island.is/application/ui-components'
import {
  Accordion,
  AccordionItem,
  Box,
  Divider,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useEffect, useState } from 'react'
import { FileItem } from './FileItem'
import { Markdown } from '@island.is/shared/components'

interface Props extends FieldBaseProps {
  field: OverviewField
}

export const OverviewFormField = ({
  field,
  application,
  goToScreen,
}: Props) => {
  const {
    title,
    titleVariant = 'h3',
    description,
    backId,
    bottomLine,
    items: rawItems,
    loadItems: rawLoadItems,
    attachments: rawAttachments,
    tableData: rawTableData,
    loadTableData: rawLoadTableData,
  } = field
  const apolloClient = useApolloClient()
  const [loadedItems, setLoadedItems] = useState<KeyValueItem[] | undefined>([])
  const [loadedTableData, setLoadedTableData] = useState<
    TableData | undefined
  >()
  const [hasLoadingError, setHasLoadingError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { formatMessage, lang: locale } = useLocale()

  const userInfo = useUserInfo()
  const items = rawItems?.(
    application.answers,
    application.externalData,
    userInfo?.profile?.nationalId,
    locale,
  )
  const filteredItems = items?.filter(
    (item) =>
      !(
        item.hideIfEmpty &&
        (!item.valueText ||
          (Array.isArray(item.valueText) && item.valueText.length === 0))
      ),
  )
  const attachments = rawAttachments?.(
    application.answers,
    application.externalData,
  )
  const tableData = rawTableData?.(
    application.answers,
    application.externalData,
  )

  let backIdVal: string | undefined
  if (typeof backId === 'function') {
    backIdVal = backId(application.answers, application.externalData)
  } else {
    backIdVal = backId
  }

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const load = async () => {
    try {
      setHasLoadingError(false)
      setIsLoading(true)
      const loaded = await rawLoadItems?.(
        application.answers,
        application.externalData,
        userInfo?.profile?.nationalId,
        apolloClient,
        locale,
      )
      const filteredLoadedItems = loaded?.filter(
        (item) =>
          !(
            item.hideIfEmpty &&
            (!item.valueText ||
              (Array.isArray(item.valueText) && item.valueText.length === 0))
          ),
      )

      const loadedTable = await rawLoadTableData?.(
        application.answers,
        application.externalData,
        apolloClient,
        locale,
      )
      setLoadedItems(filteredLoadedItems)
      setLoadedTableData(loadedTable)
      setIsLoading(false)
    } catch {
      setHasLoadingError(true)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderItems = (item: KeyValueItem, i: number) => {
    const span: SpanType | undefined =
      item.width === 'full'
        ? title || description
          ? ['12/12', '12/12', '12/12', '12/12']
          : i === 0
          ? ['10/12', '10/12', '10/12', '10/12']
          : ['12/12', '12/12', '12/12', '12/12']
        : item.width === 'half'
        ? ['9/12', '9/12', '9/12', '5/12']
        : undefined

    if (!item.keyText && !item.valueText) {
      return (
        <GridColumn key={`renderItems-${i}`} span={span}>
          {item.lineAboveKeyText && (
            <Box paddingBottom={3}>
              <Divider weight="black" thickness="thick" />
            </Box>
          )}
        </GridColumn>
      )
    }

    const createFormattedKeyTextWithIndex = (
      item: KeyValueItem,
      index?: number,
    ): string => {
      const keyText =
        Array.isArray(item?.keyText) && index !== undefined
          ? item?.keyText?.[index] ?? ''
          : item?.keyText ?? ''

      const formattedKey = formatTextWithLocale(
        keyText,
        application,
        locale,
        formatMessage,
      )

      return `${item?.boldValueText ? '**' : ''}${formattedKey}: ${
        item?.boldValueText ? '**' : ''
      }`
    }

    const keyTextValue = formatTextWithLocale(
      item?.keyText ?? '',
      application,
      locale,
      formatMessage,
    )

    return (
      <GridColumn key={i} span={span}>
        {item.lineAboveKeyText && (
          <Box paddingBottom={2}>
            <Divider weight="black" thickness="thick" />
          </Box>
        )}
        {!item.inlineKeyText && (
          <Markdown>
            {`#### **${
              Array.isArray(keyTextValue) //H4 markdown and bold
                ? keyTextValue.join(', ')
                : keyTextValue
            }**`}
          </Markdown>
        )}
        {Array.isArray(item?.valueText) ? (
          item.valueText.map((value, index) => {
            const prefix =
              item.inlineKeyText && Array.isArray(item?.keyText)
                ? createFormattedKeyTextWithIndex(item, index)
                : ''

            const valueStr = Array.isArray(value)
              ? formatTextWithLocale(
                  value,
                  application,
                  locale,
                  formatMessage,
                ).join(', ')
              : formatTextWithLocale(value, application, locale, formatMessage)

            const renderedValue = item.boldValueText
              ? `**${valueStr}**`
              : valueStr
            return (
              <Markdown key={`${value}-${index}`}>
                {`${prefix}${renderedValue}`}
              </Markdown>
            )
          })
        ) : (
          <Markdown>
            {`${
              item.inlineKeyText &&
              !Array.isArray(item?.keyText) &&
              keyTextValue
                ? `${keyTextValue}: `
                : ''
            }${formatTextWithLocale(
              item?.valueText ?? '',
              application,
              locale,
              formatMessage,
            )}`}
          </Markdown>
        )}
      </GridColumn>
    )
  }

  const renderTableData = (data: TableData) => {
    return (
      <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
        <Box
          marginTop={
            filteredItems || loadedItems || description || title ? 0 : 8
          }
        >
          <Table.Table>
            <Table.Head>
              <Table.Row>
                {data.header.map((cell, index) => (
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
              {data.rows.map((row, rowIndex) => (
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
    )
  }

  if (
    field.hideIfEmpty &&
    !filteredItems?.length &&
    !attachments?.length &&
    !tableData?.rows?.length
  ) {
    return null
  }

  const rowData = (
    <GridRow rowGap={3}>
      {isLoading ? (
        <SkeletonLoader
          height={40}
          width={title || description ? '100%' : '80%'}
          borderRadius="large"
        />
      ) : hasLoadingError ? (
        <GridColumn>
          <Text variant="eyebrow" color="red600" paddingTop={2}>
            {formatTextWithLocale(
              coreErrorMessages.failedDataProvider,
              application,
              locale,
              formatMessage,
            )}
          </Text>
        </GridColumn>
      ) : (
        <>
          {filteredItems &&
            filteredItems?.map((item, i) => renderItems(item, i))}
          {loadedItems && loadedItems?.map((item, i) => renderItems(item, i))}
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
                  <Box marginTop={!description && !title && i === 0 ? 8 : 0}>
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
          {tableData &&
            tableData.header.length > 0 &&
            renderTableData(tableData)}
          {loadedTableData &&
            loadedTableData.header.length > 0 &&
            renderTableData(loadedTableData)}
        </>
      )}
    </GridRow>
  )

  if (field.displayTitleAsAccordion) {
    return (
      <Accordion>
        <AccordionItem
          key={`${field.id}-accordion-item`}
          id={`${field.id}-accordion-item`}
          label={
            <Box marginRight={12}>
              {title && (
                <Text
                  variant={titleVariant}
                  as={titleVariant}
                  paddingTop={2}
                  paddingBottom={2}
                >
                  {formatTextWithLocale(
                    title,
                    application,
                    locale,
                    formatMessage,
                  )}
                </Text>
              )}
              {description && (
                <Text as="p" paddingTop={0} paddingBottom={2}>
                  {formatTextWithLocale(
                    description,
                    application,
                    locale,
                    formatMessage,
                  )}
                </Text>
              )}
            </Box>
          }
        >
          <ReviewGroup
            isLast={!bottomLine}
            hideTopDivider={true}
            editAction={() => changeScreens(backIdVal ?? '')}
            isEditable={backIdVal !== undefined}
          >
            {rowData}
          </ReviewGroup>
        </AccordionItem>
      </Accordion>
    )
  } else {
    return (
      <ReviewGroup
        isLast={!bottomLine}
        editAction={() => changeScreens(backIdVal ?? '')}
        isEditable={backIdVal !== undefined}
      >
        <Box marginRight={12}>
          {title && (
            <Text
              variant={titleVariant}
              as={titleVariant}
              paddingTop={2}
              paddingBottom={description ? 2 : 5}
            >
              {formatTextWithLocale(title, application, locale, formatMessage)}
            </Text>
          )}
          {description && (
            <Text as="p" paddingTop={0} paddingBottom={2}>
              {formatTextWithLocale(
                description,
                application,
                locale,
                formatMessage,
              )}
            </Text>
          )}
        </Box>
        {rowData}
      </ReviewGroup>
    )
  }
}
