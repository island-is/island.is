import React, { useMemo, useState } from 'react'
import {
  Text,
  Table as T,
  Icon,
  TagVariant,
  Tag,
} from '@island.is/island-ui/core'
import * as styles from './SortableTable.css'
import { ExpandHeader, ExpandRow } from '../ExpandableTable'

type ConfigType = { direction: 'ascending' | 'descending'; key: string }

type SortableData = {
  name: string
  id: string
  tag?: TagVariant
  children?: React.ReactElement
} & { [key: string]: string | React.ReactElement }

type SortableTableProps = {
  items: Array<SortableData>
  labels: {
    [key: string]: string
  }
  footer?: {
    [key: string]: string | number
  }
  title?: string
  tagOutlined?: boolean
  expandable?: boolean // Uses "children" key for expandable rows
  defaultSortByKey?: string // Starting sort key, use one of keys in SortableData
}

const useSortableData = <T,>(
  items: T[],
  config: ConfigType = { direction: 'ascending', key: '' },
) => {
  const [sortConfig, setSortConfig] = useState<ConfigType>(config)

  const sortedItems = useMemo(() => {
    const sortableItems = [...items]
    if (sortConfig.key !== '') {
      sortableItems.sort((a, b) => {
        const keyA = a[sortConfig.key as keyof T] as string
        const keyB = b[sortConfig.key as keyof T] as string
        if (sortConfig.direction === 'ascending') {
          return keyA.localeCompare(keyB, undefined, { numeric: true })
        } else {
          return keyA.localeCompare(keyB, undefined, { numeric: true }) * -1
        }
      })
    }
    return sortableItems
  }, [items, sortConfig])

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return { items: sortedItems, requestSort, sortConfig }
}

export const SortableTable = (props: SortableTableProps) => {
  const { items, requestSort, sortConfig } = useSortableData<SortableData>(
    props.items,
    { direction: 'ascending', key: props.defaultSortByKey ?? 'name' },
  )
  const [headerSorted, setHeaderSorted] = useState<string[]>([])

  useMemo(() => {
    const headerItems = props.items
      .map((headerItem) => {
        const { id: headerID, tag, ...restItems } = headerItem
        return Object.keys(restItems)
      })
      .flat()
      .filter((value, index, self) => self.indexOf(value) === index)

    // Remove children from header if expandable
    const childrenIndex = headerItems.indexOf('children')
    props.expandable && headerItems.splice(childrenIndex, 1)

    setHeaderSorted(headerItems)
  }, [props.items])

  // Common header button for sorting
  const headerButton = (headItem: string, i: number) => {
    return (
      <button
        type="button"
        onClick={() => requestSort(headItem)}
        className={styles.btn}
        key={`head-${headItem}-${i}`}
      >
        {props.labels[headItem] || ''}
        {sortConfig.key === headItem &&
          sortConfig.direction === 'ascending' && (
            <Icon
              className={styles.chevron}
              color="dark400"
              icon="chevronDown"
              size="small"
            />
          )}
        {sortConfig.key === headItem &&
          sortConfig.direction === 'descending' && (
            <Icon
              className={styles.chevron}
              color="dark400"
              icon="chevronUp"
              size="small"
            />
          )}
      </button>
    )
  }

  return (
    <>
      {props.title && (
        <Text variant="h4" as="h2" marginBottom={2}>
          {props.title}
        </Text>
      )}
      <T.Table>
        {props.expandable ? (
          <ExpandHeader
            data={headerSorted.map((headItem, i) => {
              return {
                value: headerButton(headItem, i),
                align: headerSorted.slice(-2).includes(headItem)
                  ? 'right'
                  : 'left',
                element: true,
              }
            })}
          />
        ) : (
          <T.Head>
            <T.Row>
              {headerSorted?.map((headItem, i) => (
                <T.HeadData key={`head-${headItem}`}>
                  {headerButton(headItem, i)}
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
        )}
        <T.Body>
          {items.map((item) => {
            const { id, name, tag, children, ...itemObject } = item
            const valueItems = Object.values(itemObject)

            return props.expandable ? (
              <ExpandRow
                key={id}
                data={valueItems.map((valueItem, i) => ({
                  value:
                    valueItems.length - 1 === i && tag ? (
                      <Tag variant={tag} outlined={props.tagOutlined}>
                        {valueItem}
                      </Tag>
                    ) : (
                      valueItem
                    ),
                  align: valueItems.slice(-2).includes(valueItem)
                    ? 'right'
                    : 'left',
                }))}
              >
                {children}
              </ExpandRow>
            ) : (
              <T.Row key={id}>
                <T.Data>{name}</T.Data>
                {valueItems.map((valueItem, i) => {
                  const lastItem = valueItems.length - 1 === i
                  return (
                    <T.Data key={`body-${id}-${i}`}>
                      {lastItem && tag ? (
                        <Tag variant={tag} outlined={props.tagOutlined}>
                          {valueItem}
                        </Tag>
                      ) : (
                        valueItem
                      )}
                    </T.Data>
                  )
                })}
              </T.Row>
            )
          })}
          {props.footer ? (
            <T.Row>
              {Object.values(props.footer).map((valueItem) => {
                return (
                  <T.Data
                    text={{ fontWeight: 'semiBold' }}
                    borderColor={'white'}
                    key={`footer-${valueItem}`}
                  >
                    {valueItem}
                  </T.Data>
                )
              })}
            </T.Row>
          ) : undefined}
        </T.Body>
      </T.Table>
    </>
  )
}
