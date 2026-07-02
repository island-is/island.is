import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Column, useExpanded, useSortBy, useTable } from 'react-table'
import { ApolloError } from '@apollo/client'

import { IcelandicGovernmentInstitutionsInvoiceGroup } from '@island.is/api/schema'
import {
  Box,
  Button,
  Icon,
  SkeletonLoader,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/shared/utils'

import { EmptyTable } from '../components/EmptyTable/EmptyTable'
import { m } from '../messages'
import { NestedLines } from './NestedLines'
import * as styles from './Overview.css'

const DEFAULT_SKELETON_ROW_COUNT = 4

interface Props {
  dateTo?: Date
  dateFrom?: Date
  invoiceGroups: Array<IcelandicGovernmentInstitutionsInvoiceGroup>
  loading?: boolean
  error?: ApolloError
}

export const OverviewTable = ({
  dateTo,
  dateFrom,
  invoiceGroups,
  loading,
  error,
}: Props) => {
  const { formatMessage } = useIntl()
  const data = useMemo(() => invoiceGroups ?? [], [invoiceGroups])

  const columns = useMemo<
    Column<IcelandicGovernmentInstitutionsInvoiceGroup>[]
  >(
    () => [
      {
        id: 'expander',
        Header: () => null,
        Cell: ({ row }) => {
          const hasInvoices = row.original.totalCount > 0
          return (
            <Box
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...(hasInvoices ? (row as any).getToggleRowExpandedProps() : {})}
              display="flex"
              alignItems="center"
              justifyContent="flexStart"
              cursor={hasInvoices ? 'pointer' : 'default'}
            >
              <Button
                circle
                colorScheme="light"
                disabled={!hasInvoices}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                icon={(row as any).isExpanded ? 'remove' : 'add'}
                iconType="filled"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="primary"
              />
            </Box>
          )
        },
      },
      {
        Header: formatMessage(m.overview.supplier),
        accessor: (row) => row.supplier.name,
        sortType: 'basic',
      },
      {
        Header: formatMessage(m.overview.customer),
        accessor: (row) => row.debtor.name,
        sortType: 'basic',
      },
      {
        Header: formatMessage(m.overview.amount),
        accessor: 'totalSum',
        sortType: 'alphanumeric',
        Cell: ({ value }) => formatCurrency(value),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formatMessage],
  )

  const tableInstance = useTable({ columns, data }, useSortBy, useExpanded)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  const renderSkeletonRow = (key: number) => (
    <T.Row key={`skeleton-${key}`}>
      <T.Data>
        <SkeletonLoader width={32} height={32} borderRadius="full" />
      </T.Data>
      <T.Data>
        <SkeletonLoader height={16} width="70%" />
      </T.Data>
      <T.Data>
        <SkeletonLoader height={16} width="70%" />
      </T.Data>
      <T.Data align="right">
        <SkeletonLoader height={16} width={72} />
      </T.Data>
    </T.Row>
  )

  const renderBody = () => {
    if (error) {
      return (
        <T.Row>
          <T.Data colSpan={columns.length}>
            <EmptyTable message={formatMessage(m.overview.errorLoading)} />
          </T.Data>
        </T.Row>
      )
    }

    if (loading) {
      const skeletonRowCount = data.length || DEFAULT_SKELETON_ROW_COUNT
      return (
        <>
          {Array.from({ length: skeletonRowCount }).map((_, i) =>
            renderSkeletonRow(i),
          )}
        </>
      )
    }

    if (!data.length) {
      return (
        <T.Row>
          <T.Data colSpan={columns.length}>
            <EmptyTable message={formatMessage(m.overview.noResults)} />
          </T.Data>
        </T.Row>
      )
    }

    return (
      <>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <React.Fragment key={row.id}>
              <T.Row {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <T.Data
                    box={{
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      background: (row as any).isExpanded
                        ? 'blue100'
                        : 'transparent',
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      borderBottomWidth: (row as any).isExpanded
                        ? undefined
                        : 'standard',
                    }}
                    {...cell.getCellProps()}
                  >
                    <Text variant="small">{cell.render('Cell')}</Text>
                  </T.Data>
                ))}
              </T.Row>

              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (row as any).isExpanded && (
                  <NestedLines
                    supplierLegalId={row.original.supplier.id}
                    erpLegalEntityId={row.original.debtor.erpLegalEntityId}
                    total={row.original.totalSum}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                  />
                )
              }
            </React.Fragment>
          )
        })}
      </>
    )
  }

  return (
    <T.Table {...getTableProps()}>
      <T.Head>
        {headerGroups.map((headerGroup) => (
          <T.Row {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <T.HeadData
                {...column.getHeaderProps(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (column as any).getSortByToggleProps(),
                )}
                box={{ className: styles.sortableHeadCell }}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  {column.render('Header')}
                  {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (column as any).isSorted ? (
                      <Box marginLeft={1}>
                        <Icon
                          color="blue400"
                          icon={
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (column as any).isSortedDesc
                              ? 'caretDown'
                              : 'caretUp'
                          }
                          size="small"
                        />
                      </Box>
                    ) : (
                      ''
                    )
                  }
                </Box>
              </T.HeadData>
            ))}
          </T.Row>
        ))}
      </T.Head>
      <T.Body {...getTableBodyProps()}>{renderBody()}</T.Body>
    </T.Table>
  )
}
