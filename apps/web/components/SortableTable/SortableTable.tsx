import { isValidElement, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import {
  Box,
  Table as T,
  Text,
} from '@island.is/island-ui/core'

import { ExpandableTableHeader } from './ExpandableTableHeader'
import { HeaderButton } from './HeaderButton'
import { TableRow } from './TableRow'
import { SortableData, SortableTableProps } from './types'
import { useSortableData } from './useSortableData'

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
  //const { width } = useWindowSize()
  //const isMobile = width < theme.breakpoints.md
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

  /*
  // Filter out the mobile title key from the header
  const mobileHeaderData = headerSorted
    .filter((headItem) => headItem !== props.mobileTitleKey)
    .map((headItem) => props.labels[headItem])
    .filter(isDefined)*/

  return (
    <>
      {props.title && (
        <Text variant="h4" as="h2" marginBottom={2}>
          {props.title}
        </Text>
      )}
     <T.Table>
          {props.expandable ? (
            <ExpandableTableHeader
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
                  <Text>Nothing here...</Text>
                </Box>
              </Box>
            )}
            {props.footer
              ? !isValidElement(props.footer) && (
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
      {props.footer && isValidElement(props.footer)
        ? props.footer
        : undefined}
    </>
  )
}
