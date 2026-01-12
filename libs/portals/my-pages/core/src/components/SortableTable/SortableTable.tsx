import {
  AlertMessage,
  Box,
  Button,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { isDefined } from 'class-validator'
import { useEffect, useState } from 'react'
import { ExpandHeader } from '../ExpandableTable'
import { MobileTable } from '../MobileTable/MobileTable'
import { HeaderButton } from './HeaderButton'
import * as styles from './SortableTable.css'
import { TableRow } from './TableRow'
import { SortableData, SortableTableProps } from './types'
import { useSortableData } from './useSortableData'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { EmptyTable } from '../EmptyTable/EmptyTable'

/**
 * SortableTable component renders a table that can be sorted and is responsive to different screen sizes.
 * It supports expandable rows and custom headers.
 *
 * @param {SortableTableProps} props - The properties for the SortableTable component.
 * @param {Array<SortableData>} props.items - The data items to be displayed in the table.
 * @param {Function} props.requestSort - Function to request sorting of the table.
 * @param {Object} props.sortConfig - Configuration object for sorting.
 * @param {string} [props.defaultSortByKey] - The default key to sort by.
 * @param {boolean} [props.expandable] - Flag to indicate if the table rows are expandable.
 * @param {Record<string, string>} props.labels - Labels for the table headers.
 * @param {string} [props.title] - Title of the table.
 * @param {boolean} [props.tagOutlined] - Flag to indicate if tags should be outlined.
 * @param {Record<string, string>} [props.footer] - Footer data for the table.
 * @param {string} [props.mobileTitleKey] - Key for the title in mobile view.
 * @param {string} [props.inner] - Inner content for the table.
 * @param {string} [props.align] - Alignment for the table headers and data.
 * @param {number} [props.ellipsisLength] - Length for ellipsis in table data.
 * @param {string} [props.emptyTableMessage] - Message to display when the table is empty.
 *
 * @returns {JSX.Element} The rendered SortableTable component.
 *
 * @example
 * <SortableTable
 *   items={data}
 *   requestSort={handleSort}
 *   sortConfig={sortConfig}
 *   defaultSortByKey="name"
 *   expandable={true}
 *   labels={labels}
 *   title="My Table"
 *   tagOutlined={false}
 *   footer={footerData}
 *   mobileTitleKey="name"
 *   inner="Some inner content"
 *   align="left"
 *   ellipsisLength={20}
 *   emptyTableMessage="No data available"
 * />
 *
 * @remarks
 * - The component uses `useSortableData` hook to manage sorting logic.
 * - It uses `useWindowSize` hook to determine if the screen size is mobile.
 * - The headers are dynamically generated based on the items' keys.
 * - On mobile, it renders a `MobileTable` component.
 * - On larger screens, it renders a table with sortable headers and expandable rows.
 */
export const SortableTable = (props: SortableTableProps) => {
  const { items, requestSort, sortConfig } = useSortableData<SortableData>(
    props.items,
    {
      direction: props.sortBy ?? 'ascending',
      key: props.defaultSortByKey,
    },
  )
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const [headerSorted, setHeaderSorted] = useState<string[]>([])

  useEffect(() => {
    const headerItems = Array.from(
      new Set(
        props.items.flatMap(
          ({ id, tag, lastNode, onExpandCallback, ...restItems }) =>
            Object.keys(restItems),
        ),
      ),
    )

    // If expandable, remove the last item and add an empty string at the beginning
    if (props.expandable) {
      headerItems.unshift('')
      headerItems.pop()
    }
    // If there is a subtitle in the first column, remove the last item
    if (props.items.find((item) => item.subTitleFirstCol)) {
      headerItems.pop()
    }
    setHeaderSorted(headerItems)
  }, [props.items, props.expandable])

  // Filter out the mobile title key from the header
  const mobileHeaderData = headerSorted
    .filter((headItem) => headItem !== props.mobileTitleKey)
    .map((headItem) => props.labels[headItem])
    .filter(isDefined)

  return (
    <>
      {props.title && (
        <Text variant="h4" as="h2" marginBottom={2}>
          {props.title}
        </Text>
      )}
      {isMobile ? (
        <MobileTable
          loading={props.tableLoading}
          inner={props.inner}
          header={props.title ?? ''}
          rows={items.map((item) => {
            // Destructure the item object and remove some values not relative for the data mapping
            const {
              id,
              tag,
              lastNode,
              children,
              subTitleFirstCol,
              onExpandCallback,
              ...itemObject
            } = item
            // Remove the key that matches the "mobileTitleKey"
            const valueItems = Object.entries(itemObject)
              .filter(([key]) => key !== props.mobileTitleKey)
              .map(([, value]) => value)
            let action = undefined
            return {
              title: props.mobileTitleKey
                ? item[props.mobileTitleKey]
                : undefined,
              onExpandCallback,
              data: valueItems
                .map((valueItem, valueIndex) => {
                  if (
                    tag &&
                    valueItems.length - 1 === valueIndex &&
                    typeof valueItem === 'string'
                  ) {
                    return {
                      title: valueItem ?? '',
                      content: (
                        <Tag
                          variant={tag}
                          outlined={props.tagOutlined}
                          disabled
                        >
                          {valueItem}
                        </Tag>
                      ),
                    }
                  }
                  if (valueItems.length - 1 === valueIndex && lastNode) {
                    if (lastNode.type === 'info') {
                      action = (
                        <AlertMessage type="info" message={lastNode.label} />
                      )
                    } else if (lastNode.type === 'action' && lastNode.action) {
                      action = (
                        <div className={styles.btnContainer}>
                          <Button
                            variant="ghost"
                            type="button"
                            icon={lastNode.icon?.icon}
                            iconType={lastNode.icon?.type}
                            onClick={lastNode.action}
                            size="small"
                            fluid
                          >
                            {lastNode.label}
                          </Button>
                        </div>
                      )
                    } else {
                      return {
                        title: valueItem ?? '',
                        content: lastNode.label,
                      }
                    }
                  }
                  return {
                    title: mobileHeaderData[valueIndex] ?? '',
                    content: valueItem,
                  }
                })
                .filter(Boolean),
              children,
              action,
            }
          })}
        />
      ) : (
        <T.Table>
          {props.expandable ? (
            <ExpandHeader
              data={headerSorted.map((headItem, i) => ({
                value: (
                  <HeaderButton
                    headItem={headItem}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    labels={props.labels}
                    index={i}
                    align={props.align ?? 'left'}
                  />
                ),
                element: true,
              }))}
            />
          ) : (
            <T.Head>
              <T.Row>
                {headerSorted.map((headItem, i) => (
                  <T.HeadData
                    key={`head-${headItem}`}
                    align={props.align ?? 'left'}
                  >
                    <Text variant="medium" fontWeight="semiBold" as="p">
                      <HeaderButton
                        headItem={headItem}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                        labels={props.labels}
                        index={i}
                      />
                    </Text>
                  </T.HeadData>
                ))}
              </T.Row>
            </T.Head>
          )}
          <T.Body>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  item={item}
                  tagOutlined={props.tagOutlined}
                  expandable={props.expandable}
                  onExpandCallback={item.onExpandCallback}
                  align={props.align ?? 'left'}
                  ellipsisLength={props.ellipsisLength}
                />
              ))
            ) : (
              <Box background="blue100" padding={3}>
                <Box background="white">
                  <EmptyTable
                    message={props.emptyTableMessage}
                    background="white"
                    loading={props.tableLoading}
                  />
                </Box>
              </Box>
            )}
            {props.footer
              ? !React.isValidElement(props.footer) && (
                  <T.Row>
                    <T.Data
                      text={{ fontWeight: 'semiBold' }}
                      borderColor="white"
                      key="footer-empty"
                      unselectable="on"
                    >
                      {/* Empty cell at index 0 */}
                    </T.Data>
                    {Object.values(props.footer).map((valueItem) => (
                      <T.Data
                        text={{ fontWeight: 'semiBold' }}
                        borderColor="white"
                        key={`footer-${valueItem}`}
                      >
                        {valueItem}
                      </T.Data>
                    ))}
                  </T.Row>
                )
              : null}
          </T.Body>
        </T.Table>
      )}
      {props.footer && React.isValidElement(props.footer)
        ? props.footer
        : undefined}
    </>
  )
}
