import React, { useMemo, useState } from 'react'
import {
  Text,
  Table as T,
  Icon,
  TagVariant,
  Tag,
} from '@island.is/island-ui/core'
import * as styles from './SortableTable.css'

type ConfigType = { direction: 'ascending' | 'descending'; key: string }

type SortableData = {
  name: string
  id: string
  tag?: TagVariant
} & { [key: string]: string }

type SortableTableProps = {
  items: Array<SortableData>
  labels: {
    [key: string]: string
  }
  footer?: {
    [key: string]: string | number
  }
  title?: string
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
    { direction: 'ascending', key: 'name' },
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

    setHeaderSorted(headerItems)
  }, [props.items])

  return (
    <>
      {props.title && (
        <Text variant="h4" as="h2" marginBottom={2}>
          {props.title}
        </Text>
      )}
      <T.Table>
        <T.Head>
          <T.Row>
            {headerSorted?.map((headItem) => (
              <T.HeadData key={`head-${headItem}`}>
                <button
                  type="button"
                  onClick={() => requestSort(headItem)}
                  className={styles.btn}
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
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {items.map((item, i) => {
            const { id, name, tag, ...itemObject } = item
            const valueItems = Object.values(itemObject)
            return (
              <T.Row key={id}>
                <T.Data>{name}</T.Data>
                {valueItems.map((valueItem, i) => {
                  const lastItem = valueItems.length - 1 === i
                  return (
                    <T.Data key={`body-${id}-${i}`}>
                      {lastItem && tag ? (
                        <Tag variant={tag}>{valueItem}</Tag>
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
