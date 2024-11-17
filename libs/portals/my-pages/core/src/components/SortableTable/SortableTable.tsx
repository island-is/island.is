import {
  AlertMessage,
  Button,
  Icon,
  Table as T,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { isDefined } from 'class-validator'
import { useMemo, useState } from 'react'
import { useWindowSize } from 'react-use'
import { ExpandHeader, ExpandRow } from '../ExpandableTable'
import * as styles from './SortableTable.css'
import { SortableData, SortableTableProps } from './dataMapper'
import MobileTable from './Mobile/MobileTable'

type ConfigType = { direction: 'ascending' | 'descending'; key: string }

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
        return sortConfig.direction === 'ascending'
          ? keyA.localeCompare(keyB, undefined, { numeric: true })
          : keyA.localeCompare(keyB, undefined, { numeric: true }) * -1
      })
    }
    return sortableItems
  }, [items, sortConfig])

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
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

  const headerButton = (headItem: string, i: number) => (
    <button
      type="button"
      onClick={() => requestSort(headItem)}
      className={styles.btn}
      key={`head-${headItem}-${i}`}
    >
      {props.labels[headItem] || ''}
      {sortConfig.key === headItem && (
        <Icon
          className={styles.chevron}
          color="dark400"
          icon={
            sortConfig.direction === 'ascending' ? 'chevronDown' : 'chevronUp'
          }
          size="small"
        />
      )}
    </button>
  )

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
                  if (tag) {
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
                value: headerButton(headItem, i),
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
                      {headerButton(headItem, i)}
                    </Text>
                  </T.HeadData>
                ))}
              </T.Row>
            </T.Head>
          )}
          <T.Body>
            {items.map((item) => {
              const { id, name, tag, lastNode, children, ...itemObject } = item
              const valueItems = Object.values(itemObject)

              return props.expandable ? (
                <ExpandRow
                  key={id}
                  data={valueItems.map((valueItem, i) => ({
                    value: tag ? (
                      <Tag variant={tag} outlined={props.tagOutlined}>
                        {valueItem}
                      </Tag>
                    ) : valueItems.length - 1 === i && lastNode ? (
                      lastNode.type === 'info' ? (
                        <Tooltip text={lastNode.label} />
                      ) : lastNode.type === 'action' ? (
                        <Button
                          variant="text"
                          type="button"
                          icon={lastNode.icon?.icon}
                          iconType={lastNode.icon?.type}
                          onClick={lastNode.action}
                          size="small"
                        >
                          {lastNode.label}
                        </Button>
                      ) : (
                        <Text variant="medium" as="span">
                          {lastNode.label}
                        </Text>
                      )
                    ) : (
                      <Text variant="medium" as="span">
                        {valueItem}
                      </Text>
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
                  <T.Data>
                    <Text variant="medium" as="span">
                      {name}
                    </Text>
                  </T.Data>
                  {valueItems.map((valueItem, i) => (
                    <T.Data key={`body-${id}-${i}`}>
                      {tag ? (
                        <Tag variant={tag} outlined={props.tagOutlined}>
                          {valueItem}
                        </Tag>
                      ) : lastNode ? (
                        lastNode.type === 'info' ? (
                          <Tooltip text={lastNode.label} />
                        ) : lastNode.type === 'action' ? (
                          <Button
                            variant="text"
                            type="button"
                            icon={lastNode.icon?.icon}
                            iconType={lastNode.icon?.type}
                            onClick={lastNode.action}
                          >
                            {lastNode.label}
                          </Button>
                        ) : (
                          <Text variant="medium" as="span">
                            {lastNode.label}
                          </Text>
                        )
                      ) : (
                        <Text variant="medium" as="span">
                          {valueItem}
                        </Text>
                      )}
                    </T.Data>
                  ))}
                </T.Row>
              )
            })}
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
