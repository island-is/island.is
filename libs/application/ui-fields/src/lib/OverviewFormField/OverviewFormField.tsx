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
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useEffect, useState } from 'react'
import { FileItem } from './FileItem'
import { RenderItems } from './RenderItems'
import { changeScreens, isEmpty, tableDataToShow } from './overviewUtils'
import { RenderTableData } from './RenderTableData'

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
    (item) => !item.hideIfEmpty || !isEmpty(item.valueText),
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

  if (
    field.hideIfEmpty &&
    !filteredItems?.length &&
    !attachments?.length &&
    !tableData?.rows?.length
  ) {
    return null
  }

  const tableDataToRender = tableDataToShow(tableData, loadedTableData)

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
            filteredItems.map((item, i) => (
              <RenderItems
                key={`filtered-${i}`}
                item={item}
                i={i}
                title={title}
                description={description}
                application={application}
              />
            ))}
          {loadedItems &&
            loadedItems.map((item, i) => (
              <RenderItems
                key={`loaded-${i}`}
                item={item}
                i={i}
                title={title}
                description={description}
                application={application}
              />
            ))}
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
          {tableDataToRender && (
            <RenderTableData
              data={tableDataToRender}
              application={application}
              title={title}
              description={description}
              filteredItems={filteredItems}
              loadedItems={loadedItems}
            />
          )}
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
            editAction={() => changeScreens(backIdVal ?? '', goToScreen)}
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
        editAction={() => changeScreens(backIdVal ?? '', goToScreen)}
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
