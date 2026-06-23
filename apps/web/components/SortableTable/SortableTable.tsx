import { ReactNode, useState } from 'react'

import { Icon, Table as T, Text } from '@island.is/island-ui/core'

export type SortableTableColumn<T> = {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

interface Props<T extends Record<string, any>> {
  columns: SortableTableColumn<T>[]
  data: T[]
  defaultSortKey?: keyof T
  defaultSortDir?: 'asc' | 'desc'
  onRowClick?: (row: T) => void
}

export const SortableTable = <T extends Record<string, any>>({
  columns,
  data,
  defaultSortKey,
  defaultSortDir = 'asc',
  onRowClick,
}: Props<T>) => {
  const [sortKey, setSortKey] = useState<keyof T>(
    defaultSortKey ?? columns[0].key,
  )
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir)

  const handleSort = (key: keyof T) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    const av = String(a[sortKey] ?? '').toLowerCase()
    const bv = String(b[sortKey] ?? '').toLowerCase()
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          {columns.map(({ key, label }) => (
            <T.HeadData key={String(key)}>
              <button
                onClick={() => handleSort(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Text variant="h5" as="span">
                  {label}
                </Text>
                <Icon
                  icon={
                    sortKey === key && sortDir === 'desc'
                      ? 'caretUp'
                      : 'caretDown'
                  }
                  size="small"
                  color={sortKey === key ? 'blue400' : 'blue300'}
                />
              </button>
            </T.HeadData>
          ))}
        </T.Row>
      </T.Head>
      <T.Body>
        {sorted.map((item, i) => (
          <tr
            key={i}
            style={
              onRowClick
                ? { position: 'relative', cursor: 'pointer' }
                : undefined
            }
          >
            {columns.map(({ key, render }, colIdx) => (
              <T.Data key={String(key)}>
                {colIdx === 0 && onRowClick && (
                  <button
                    type="button"
                    aria-label={String(item[key])}
                    onClick={() => onRowClick(item)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'none',
                      border: 'none',
                      cursor: 'inherit',
                    }}
                  />
                )}
                {render ? render(item[key], item) : (item[key] as string)}
              </T.Data>
            ))}
          </tr>
        ))}
      </T.Body>
    </T.Table>
  )
}

export default SortableTable
