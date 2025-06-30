import { useApolloClient } from '@apollo/client/react'
import {
  coreErrorMessages,
  formatTextWithLocale,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  KeyValueItem,
  OverviewField,
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
  } = field
  const apolloClient = useApolloClient()
  const [loadedItems, setLoadedItems] = useState<KeyValueItem[] | undefined>([])
  const [hasLoadingError, setHasLoadingError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const userInfo = useUserInfo()
  const items = rawItems?.(
    application.answers,
    application.externalData,
    userInfo?.profile?.nationalId,
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

  const { formatMessage, lang: locale } = useLocale()
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
      )
      setLoadedItems(loaded)
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
        <GridColumn span={span}>
          {item.lineAboveKeyText && (
            <Box paddingBottom={3}>
              <Divider weight="black" thickness="thick" />
            </Box>
          )}
        </GridColumn>
      )
    }

    return (
      <GridColumn key={i} span={span}>
        {item.lineAboveKeyText && (
          <Box paddingBottom={2}>
            <Divider weight="black" thickness="thick" />
          </Box>
        )}
        {!item.inlineKeyText && (
          <Text variant="h5">
            {formatTextWithLocale(
              item?.keyText ?? '',
              application,
              locale,
              formatMessage,
            )}
          </Text>
        )}
        {Array.isArray(item?.valueText) ? (
          item?.valueText.map((value, index) => (
            <Text
              key={`${value}-${index}`}
              fontWeight={item.boldValueText ? 'semiBold' : 'light'}
            >
              {item.inlineKeyText &&
                Array.isArray(item?.keyText) &&
                `${formatTextWithLocale(
                  item?.keyText?.[index] ?? '',
                  application,
                  locale,
                  formatMessage,
                )}: `}
              {Array.isArray(value)
                ? formatTextWithLocale(
                    value,
                    application,
                    locale,
                    formatMessage,
                  ).join(', ')
                : formatTextWithLocale(
                    value,
                    application,
                    locale,
                    formatMessage,
                  )}
            </Text>
          ))
        ) : (
          <Text fontWeight={item.boldValueText ? 'semiBold' : 'light'}>
            {item.inlineKeyText &&
              !Array.isArray(item?.keyText) &&
              `${formatTextWithLocale(
                item?.keyText ?? '',
                application,
                locale,
                formatMessage,
              )}: `}
            {formatTextWithLocale(
              item?.valueText ?? '',
              application,
              locale,
              formatMessage,
            )}
          </Text>
        )}
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
      {filteredItems && filteredItems?.map((item, i) => renderItems(item, i))}
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
        loadedItems && loadedItems?.map((item, i) => renderItems(item, i))
      )}
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
      {tableData && tableData.header.length > 0 && (
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Box
            marginTop={
              filteredItems || loadedItems || description || title ? 0 : 8
            }
          >
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
            editAction={() =>
              changeScreens(
                typeof backId === 'function'
                  ? backId(application.answers) ?? ''
                  : backId ?? '',
              )
            }
            isEditable={backId !== undefined}
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
        editAction={() =>
          changeScreens(
            typeof backId === 'function'
              ? backId(application.answers) ?? ''
              : backId ?? '',
          )
        }
        isEditable={backId !== undefined}
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
