import { useMemo } from 'react'
import { Column, useExpanded, useSortBy, useTable } from 'react-table'

import { IcelandicGovernmentInstitutionsInvoiceGroup } from '@island.is/api/schema'
import { Box, Button, Icon, Table as T, Text } from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/shared/utils'

import { EmptyTable } from '../components/EmptyTable/EmptyTable'
import { NestedLines } from './NestedLines'

interface Props {
  dateTo?: Date
  dateFrom?: Date
  invoiceGroups: Array<IcelandicGovernmentInstitutionsInvoiceGroup>
  //loading?: boolean
  //error?: ApolloError
}

export const OverviewTable = ({ dateTo, dateFrom, invoiceGroups }: Props) => {
  const data = useMemo(() => invoiceGroups ?? [], [invoiceGroups])

  const columns = useMemo<
    Column<IcelandicGovernmentInstitutionsInvoiceGroup>[]
  >(
    () => [
      {
        id: 'expander',
        Header: () => null,
        Cell: ({ row }) => (
          <Box
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(row as any).getToggleRowExpandedProps()}
            display="flex"
            alignItems="center"
            justifyContent="flexStart"
            cursor="pointer"
          >
            <Button
              circle
              colorScheme="light"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              icon={(row as any).isExpanded ? 'remove' : 'add'}
              iconType="filled"
              preTextIconType="filled"
              size="small"
              type="button"
              variant="primary"
            />
          </Box>
        ),
      },
      {
        Header: 'Seljandi',
        accessor: (row) => row.supplier.name,
        sortType: 'basic',
      },
      {
        Header: 'Kaupandi',
        accessor: (row) => row.customer.name,
        sortType: 'basic',
      },
      {
        Header: 'Upphæð',
        accessor: 'totalSum',
        sortType: 'alphanumeric',
        Cell: ({ value }) => formatCurrency(value),
      },
    ],
    [],
  )

  const tableInstance = useTable({ columns, data }, useSortBy, useExpanded)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  if (!data.length) {
    return <EmptyTable message="Ekkert fannst. Prófaðu að breyta skilyrðum" />
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
                style={{ cursor: 'pointer' }}
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
      <T.Body {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <>
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
                    supplierId={row.original.supplier.id}
                    customerId={row.original.customer.id}
                    total={row.original.totalSum}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                  />
                )
              }
            </>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
