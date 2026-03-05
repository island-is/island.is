import {
  FieldBaseProps,
  PaginatedSearchableTableField,
  PaginatedSearchableTableRow,
} from '@island.is/application/types'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Checkbox,
  Input,
  LoadingDots,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useFormContext } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { useApolloClient } from '@apollo/client'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SEARCH_DEBOUNCE_MS = 300

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
  const apolloClient = useApolloClient()

  const [inputValue, setInputValue] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  useDebounce(
    () => {
      setDebouncedSearchTerm(inputValue)
      setPage(1)
    },
    DEFAULT_SEARCH_DEBOUNCE_MS,
    [inputValue],
  )

  const [changedRowsById, setChangedRowsById] = useState<
    Record<string, PaginatedSearchableTableRow>
  >({})

  const isServerSide = !!field.serverSideFetch
  const isSelectable = !!field.selectable

  // --- Server-side state ---
  const [serverRows, setServerRows] = useState<PaginatedSearchableTableRow[]>(
    [],
  )
  const [serverTotalRows, setServerTotalRows] = useState(0)
  const [serverLoading, setServerLoading] = useState(false)

  // --- Selection state ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    if (!isSelectable) return new Set()
    const existing =
      getValueViaPath<string[]>(application.answers, field.id) ?? []
    return new Set(existing)
  })
  const [selectedDetails, setSelectedDetails] = useState<
    Map<string, PaginatedSearchableTableRow>
  >(() => {
    if (!isSelectable || !field.selectedDetailsKey) return new Map()
    const existing =
      getValueViaPath<PaginatedSearchableTableRow[]>(
        application.answers,
        field.selectedDetailsKey,
      ) ?? []
    return new Map(existing.map((row) => [getRowId(row, field.rowIdKey), row]))
  })

  // --- Client-side data ---
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
    if (isServerSide) return {}
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
  }, [rowIdKey, rows, isServerSide])

  // --- Registration ---
  useEffect(() => {
    register(answerKey)
    if (field.selectedDetailsKey) {
      register(field.selectedDetailsKey)
    }
    return () => {
      unregister(answerKey)
      if (field.selectedDetailsKey) {
        unregister(field.selectedDetailsKey)
      }
    }
  }, [answerKey, field.selectedDetailsKey, register, unregister])

  // --- Client-side: load existing changed rows ---
  useEffect(() => {
    if (isServerSide || isSelectable) return

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
  }, [
    answerKey,
    application.answers,
    baseRowsById,
    rowIdKey,
    isServerSide,
    isSelectable,
  ])

  // --- Server-side: fetch data ---
  const serverSideFetch = field.serverSideFetch
  useEffect(() => {
    if (!isServerSide || !serverSideFetch) return

    let cancelled = false
    setServerLoading(true)

    serverSideFetch({
      apolloClient,
      page,
      pageSize,
      searchTerm: debouncedSearchTerm,
    })
      .then(({ rows: fetchedRows, totalRows }) => {
        if (cancelled) return
        setServerRows(fetchedRows)
        setServerTotalRows(totalRows)
        setServerLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setServerRows([])
        setServerTotalRows(0)
        setServerLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [
    isServerSide,
    serverSideFetch,
    apolloClient,
    page,
    pageSize,
    debouncedSearchTerm,
  ])

  // --- Selection toggle ---
  const handleToggleSelection = useCallback(
    (row: PaginatedSearchableTableRow) => {
      const rowId = getRowId(row, rowIdKey)
      if (!rowId) return

      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(rowId)) {
          next.delete(rowId)
        } else {
          next.add(rowId)
        }
        return next
      })

      setSelectedDetails((prev) => {
        const next = new Map(prev)
        if (next.has(rowId)) {
          next.delete(rowId)
        } else {
          next.set(rowId, row)
        }
        return next
      })
    },
    [rowIdKey],
  )

  // --- Client-side filtering + pagination ---
  const filteredRows = useMemo(() => {
    if (isServerSide) return []
    if (!debouncedSearchTerm.trim()) {
      return rows
    }

    const normalizedSearchTerm = debouncedSearchTerm.trim().toLowerCase()

    return rows.filter((row) => {
      return searchKeys.some((searchKey) => {
        return String(row[searchKey] ?? '')
          .toLowerCase()
          .includes(normalizedSearchTerm)
      })
    })
  }, [rows, searchKeys, debouncedSearchTerm, isServerSide])

  const totalPages = useMemo(() => {
    if (isServerSide) {
      return Math.max(1, Math.ceil(serverTotalRows / pageSize))
    }
    return Math.max(1, Math.ceil(filteredRows.length / pageSize))
  }, [filteredRows.length, pageSize, isServerSide, serverTotalRows])

  useEffect(() => {
    if (page <= totalPages) return
    setPage(totalPages)
  }, [page, totalPages])

  const pagedRows = useMemo(() => {
    if (isServerSide) return serverRows
    return paginate(filteredRows, pageSize, page)
  }, [filteredRows, page, pageSize, isServerSide, serverRows])

  const totalItemCount = isServerSide ? serverTotalRows : filteredRows.length

  // --- Persist: editable rows (client-side, non-selectable) ---
  const changedRows = useMemo(
    () => Object.values(changedRowsById),
    [changedRowsById],
  )
  const changedRowsRef = useRef<PaginatedSearchableTableRow[]>(changedRows)

  useEffect(() => {
    changedRowsRef.current = changedRows
  }, [changedRows])

  // --- Persist: selectable rows ---
  const selectedIdsRef = useRef(selectedIds)
  const selectedDetailsRef = useRef(selectedDetails)

  useEffect(() => {
    selectedIdsRef.current = selectedIds
  }, [selectedIds])

  useEffect(() => {
    selectedDetailsRef.current = selectedDetails
  }, [selectedDetails])

  useEffect(() => {
    if (!setBeforeSubmitCallback) return

    if (isSelectable) {
      setBeforeSubmitCallback(
        async () => {
          const ids = Array.from(selectedIdsRef.current)
          setValue(answerKey, ids, { shouldDirty: true, shouldTouch: true })

          if (field.selectedDetailsKey) {
            const details = Array.from(selectedDetailsRef.current.values())
            const saveProps = field.savePropertyNames
            const rowsToPersist = saveProps?.length
              ? details.map((row) =>
                  pickProperties(row, [rowIdKey, ...saveProps]),
                )
              : details
            setValue(field.selectedDetailsKey, rowsToPersist, {
              shouldDirty: true,
              shouldTouch: true,
            })
          }

          return [true, null]
        },
        {
          allowMultiple: true,
          customCallbackId: field.callbackId ?? `${answerKey}Persist`,
        },
      )
    } else {
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
    }
  }, [
    answerKey,
    application,
    field.callbackId,
    field.savePropertyNames,
    field.selectedDetailsKey,
    rowIdKey,
    isSelectable,
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
        inputType === 'number'
          ? value === ''
            ? baseRow[columnKey] ?? undefined
            : Number(value)
          : value

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
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />

      {isSelectable && field.selectedCountLabel && selectedIds.size > 0 && (
        <Text variant="small" fontWeight="semiBold">
          {formatText(field.selectedCountLabel, application, formatMessage)}{' '}
          {selectedIds.size}
        </Text>
      )}

      {serverLoading ? (
        <Box display="flex" justifyContent="center" padding={4}>
          <LoadingDots />
        </Box>
      ) : (
        <T.Table>
          <T.Head>
            <T.Row>
              {isSelectable && <T.HeadData />}
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
                const rowWithChanges = rowId
                  ? changedRowsById[rowId]
                  : undefined
                const isChecked =
                  isSelectable && rowId ? selectedIds.has(rowId) : false

                return (
                  <T.Row key={rowKey}>
                    {isSelectable && (
                      <T.Data>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleToggleSelection(row)}
                          aria-label={rowId}
                        />
                      </T.Data>
                    )}
                    {headers.map((header) => {
                      const value =
                        rowWithChanges?.[header.key] ?? row[header.key] ?? ''
                      if (header.editable && !isSelectable) {
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
                <T.Data colSpan={headers.length + (isSelectable ? 1 : 0)}>
                  <Text>
                    {formatText(field.emptyState, application, formatMessage)}
                  </Text>
                </T.Data>
              </T.Row>
            )}
          </T.Body>
        </T.Table>
      )}

      {totalItemCount > pageSize && (
        <Pagination
          page={page}
          totalPages={totalPages}
          renderLink={(nextPage, className, children) => (
            <Box
              component="button"
              type="button"
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
