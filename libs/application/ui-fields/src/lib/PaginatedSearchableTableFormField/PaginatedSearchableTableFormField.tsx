import {
  FieldBaseProps,
  PaginatedSearchableTableField,
  PaginatedSearchableTableRow,
} from '@island.is/application/types'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Input,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

const DEFAULT_PAGE_SIZE = 10

interface Props extends FieldBaseProps {
  field: PaginatedSearchableTableField
}

type FormValues = Record<string, unknown>

const paginate = <TItem,>(
  items: TItem[],
  pageSize: number,
  page: number,
): TItem[] => {
  const startIndex = (page - 1) * pageSize
  return items.slice(startIndex, startIndex + pageSize)
}

const getRowId = (
  row: PaginatedSearchableTableRow,
  rowIdKey: string,
): string => {
  const rowId = row[rowIdKey]
  if (rowId === null || typeof rowId === 'undefined') {
    return ''
  }

  return String(rowId)
}

const areRowsEqual = (
  left: PaginatedSearchableTableRow,
  right: PaginatedSearchableTableRow,
): boolean => {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])

  for (const key of keys) {
    if (left[key] !== right[key]) {
      return false
    }
  }

  return true
}

const pickProperties = (
  row: PaginatedSearchableTableRow,
  propertyNames: string[],
): PaginatedSearchableTableRow => {
  return propertyNames.reduce<PaginatedSearchableTableRow>(
    (accumulator, propertyName) => {
      accumulator[propertyName] = row[propertyName]
      return accumulator
    },
    {},
  )
}

export const PaginatedSearchableTableFormField: FC<Props> = ({
  application,
  field,
  setBeforeSubmitCallback,
}) => {
  const { register, setValue, unregister } = useFormContext<FormValues>()
  const { formatMessage } = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [changedRowsById, setChangedRowsById] = useState<
    Record<string, PaginatedSearchableTableRow>
  >({})

  const rows = useMemo(
    () =>
      typeof field.rows === 'function' ? field.rows(application) : field.rows,
    [application, field],
  )
  const headers = useMemo(
    () =>
      typeof field.headers === 'function'
        ? field.headers(application)
        : field.headers,
    [application, field],
  )
  const answerKey = field.id
  const rowIdKey = field.rowIdKey
  const pageSize = field.pageSize ?? DEFAULT_PAGE_SIZE
  const searchKeys = useMemo(
    () => (field.searchKeys?.length ? field.searchKeys : [rowIdKey]),
    [field.searchKeys, rowIdKey],
  )

  const baseRowsById = useMemo(() => {
    return rows.reduce<Record<string, PaginatedSearchableTableRow>>(
      (accumulator, row) => {
        const rowId = getRowId(row, rowIdKey)
        if (!rowId) {
          return accumulator
        }

        accumulator[rowId] = row
        return accumulator
      },
      {},
    )
  }, [rowIdKey, rows])

  useEffect(() => {
    register(answerKey)
    return () => unregister(answerKey)
  }, [answerKey, register, unregister])

  useEffect(() => {
    const existingRows =
      getValueViaPath<PaginatedSearchableTableRow[]>(
        application.answers,
        answerKey,
      ) ?? []

    if (!existingRows.length) {
      setChangedRowsById({})
      return
    }

    const initialChangedRowsById = existingRows.reduce<
      Record<string, PaginatedSearchableTableRow>
    >((accumulator, existingRow) => {
      const rowId = getRowId(existingRow, rowIdKey)
      if (!rowId) {
        return accumulator
      }

      const baseRow = baseRowsById[rowId]
      const mergedRow = baseRow ? { ...baseRow, ...existingRow } : existingRow

      if (!baseRow || !areRowsEqual(baseRow, mergedRow)) {
        accumulator[rowId] = mergedRow
      }

      return accumulator
    }, {})

    setChangedRowsById(initialChangedRowsById)
  }, [answerKey, application.answers, baseRowsById, rowIdKey])

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) {
      return rows
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    return rows.filter((row) => {
      return searchKeys.some((searchKey) => {
        return String(row[searchKey] ?? '')
          .toLowerCase()
          .includes(normalizedSearchTerm)
      })
    })
  }, [rows, searchKeys, searchTerm])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredRows.length / pageSize))
  }, [filteredRows.length, pageSize])

  useEffect(() => {
    if (page <= totalPages) {
      return
    }

    setPage(totalPages)
  }, [page, totalPages])

  const pagedRows = useMemo(() => {
    return paginate(filteredRows, pageSize, page)
  }, [filteredRows, page, pageSize])

  const changedRows = useMemo(
    () => Object.values(changedRowsById),
    [changedRowsById],
  )
  const changedRowsRef = useRef<PaginatedSearchableTableRow[]>(changedRows)

  useEffect(() => {
    changedRowsRef.current = changedRows
  }, [changedRows])

  useEffect(() => {
    if (!setBeforeSubmitCallback) {
      return
    }

    setBeforeSubmitCallback(
      async () => {
        const rowsToPersist = changedRowsRef.current.map((row) => {
          if (!field.savePropertyNames?.length) {
            return row
          }

          const propertiesToPersist = Array.from(
            new Set([rowIdKey, ...field.savePropertyNames]),
          )
          return pickProperties(row, propertiesToPersist)
        })

        setValue(answerKey, rowsToPersist, {
          shouldDirty: true,
          shouldTouch: true,
        })

        return [true, null]
      },
      {
        allowMultiple: true,
        customCallbackId: field.callbackId ?? `${answerKey}Persist`,
      },
    )
  }, [
    answerKey,
    application,
    field.callbackId,
    field.savePropertyNames,
    rowIdKey,
    setBeforeSubmitCallback,
    setValue,
    formatMessage,
  ])

  const handleEditableCellChange =
    (
      row: PaginatedSearchableTableRow,
      columnKey: string,
      inputType?: 'text' | 'number',
    ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rowId = getRowId(row, rowIdKey)
      if (!rowId) {
        return
      }

      const baseRow = baseRowsById[rowId] ?? row
      const existingRow = changedRowsById[rowId] ?? baseRow
      const { value } = event.target
      const nextValue =
        inputType === 'number' && value !== '' ? Number(value) : value

      const nextRow = {
        ...existingRow,
        [columnKey]: nextValue,
      }

      setChangedRowsById((previousChangedRowsById) => {
        if (areRowsEqual(baseRow, nextRow)) {
          const nextChangedRowsById = { ...previousChangedRowsById }
          delete nextChangedRowsById[rowId]
          return nextChangedRowsById
        }

        return {
          ...previousChangedRowsById,
          [rowId]: nextRow,
        }
      })
    }

  return (
    <Stack space={3}>
      <Input
        name={`${answerKey}Search`}
        label={formatText(field.searchLabel, application, formatMessage)}
        placeholder={formatText(
          field.searchPlaceholder,
          application,
          formatMessage,
        )}
        icon={{ name: 'search' }}
        backgroundColor="blue"
        size="sm"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value)
          setPage(1)
        }}
      />

      <T.Table>
        <T.Head>
          <T.Row>
            {headers.map((header) => (
              <T.HeadData key={header.key}>
                {formatText(header.label, application, formatMessage)}
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {pagedRows.length > 0 ? (
            pagedRows.map((row, rowIndex) => {
              const rowId = getRowId(row, rowIdKey)
              const rowKey = rowId || `row-${page}-${rowIndex}`
              const rowWithChanges = rowId ? changedRowsById[rowId] : undefined

              return (
                <T.Row key={rowKey}>
                  {headers.map((header) => {
                    const value =
                      rowWithChanges?.[header.key] ?? row[header.key] ?? ''
                    if (header.editable) {
                      return (
                        <T.Data key={header.key}>
                          <Input
                            name={`${answerKey}.${rowKey}.${header.key}`}
                            label=""
                            type={header.inputType ?? 'text'}
                            min={header.min}
                            size="xs"
                            backgroundColor="white"
                            value={String(value)}
                            onChange={handleEditableCellChange(
                              row,
                              header.key,
                              header.inputType,
                            )}
                          />
                        </T.Data>
                      )
                    }

                    return (
                      <T.Data key={header.key}>{String(value) || '-'}</T.Data>
                    )
                  })}
                </T.Row>
              )
            })
          ) : (
            <T.Row>
              <T.Data colSpan={headers.length}>
                <Text>
                  {formatText(field.emptyState, application, formatMessage)}
                </Text>
              </T.Data>
            </T.Row>
          )}
        </T.Body>
      </T.Table>

      {filteredRows.length > pageSize && (
        <Pagination
          page={page}
          totalPages={totalPages}
          renderLink={(nextPage, className, children) => (
            <Box
              cursor="pointer"
              className={className}
              onClick={() => setPage(nextPage)}
            >
              {children}
            </Box>
          )}
        />
      )}
    </Stack>
  )
}
