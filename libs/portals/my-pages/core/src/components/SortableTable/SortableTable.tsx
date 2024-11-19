import {
  AlertMessage,
  Button,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { isDefined } from 'class-validator'
import { useMemo, useState } from 'react'
import { useWindowSize } from 'react-use'
import { ExpandHeader } from '../ExpandableTable'
import { HeaderButton } from './HeaderButton'
import MobileTable from './Mobile/MobileTable'
import * as styles from './SortableTable.css'
import { TableRow } from './TableRow'
import { SortableData, SortableTableProps } from './types'
import { useSortableData } from './useSortableData'

/**
 * SortableTable component renders a table that can be sorted and is responsive to different screen sizes.
 * It supports expandable rows and custom headers.
 *
 * @param {SortableTableProps} props - The properties for the SortableTable component.
 * @param {Array} props.items - The data items to be displayed in the table.
 * @param {Function} props.requestSort - Function to request sorting of the table.
 * @param {Object} props.sortConfig - Configuration object for sorting.
 * @param {string} [props.defaultSortByKey] - The default key to sort by.
 * @param {boolean} [props.expandable] - Flag to indicate if the table rows are expandable.
 * @param {Object} props.labels - Labels for the table headers.
 * @param {string} [props.title] - Title of the table.
 * @param {boolean} [props.tagOutlined] - Flag to indicate if tags should be outlined.
 * @param {Object} [props.footer] - Footer data for the table.
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
    { direction: 'ascending', key: props.defaultSortByKey ?? 'name' },
  )
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const [headerSorted, setHeaderSorted] = useState<string[]>([])

  useMemo(() => {
    const headerItems = props.items
      .map(({ id, tag, lastNode, ...restItems }) => Object.keys(restItems))
      .flat()
      .filter((value, index, self) => self.indexOf(value) === index)

    if (props.expandable) {
      const childrenIndex = headerItems.indexOf('children')
      headerItems.splice(childrenIndex, 1)
    }

    setHeaderSorted(headerItems)
  }, [props.items])

  const mobileHeaderData = headerSorted
    .map((headItem) => props.labels[headItem])
    .filter(isDefined)
  if (!props.expandable) mobileHeaderData.splice(0, 1)

  return (
    <>
      {props.title && (
        <Text variant="h4" as="h2" marginBottom={2}>
          {props.title}
        </Text>
      )}
      {isMobile ? (
        <MobileTable
          header={props.title ?? ''}
          rows={items.map((item) => {
            const { id, tag, name, lastNode, children, ...itemObject } = item
            const valueItems = Object.values(itemObject)
            let action = undefined
            return {
              title: name ?? valueItems[0]?.toString() ?? '',
              data: valueItems
                .map((valueItem, valueIndex) => {
                  if (tag && valueItems.length - 1 === valueIndex) {
                    return {
                      title: valueItem ?? '',
                      content: (
                        <Tag variant={tag} outlined={props.tagOutlined}>
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
                    } else if (lastNode.type === 'action') {
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
                  />
                ),
                align: headerSorted.slice(-2).includes(headItem)
                  ? 'right'
                  : 'left',
                element: true,
              }))}
            />
          ) : (
            <T.Head>
              <T.Row>
                {headerSorted.map((headItem, i) => (
                  <T.HeadData key={`head-${headItem}`}>
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
            {items.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                headerSorted={headerSorted}
                labels={props.labels}
                tagOutlined={props.tagOutlined}
                expandable={props.expandable}
              />
            ))}
            {props.footer && (
              <T.Row>
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
            )}
          </T.Body>
        </T.Table>
      )}
    </>
  )
}
