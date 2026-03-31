import { Fragment, useMemo, useState } from 'react'
import { Column, useExpanded, useTable } from 'react-table'
import AnimateHeight from 'react-animate-height'
import {
  ShipRegistryCertificate,
  ShipRegistryCertificateStatus,
} from '@island.is/api/schema'
import { Box, Button, Input, Table as T, Tag } from '@island.is/island-ui/core'
import { EmptyTable, formatDate } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { shipsMessages } from '../../../../lib/messages'
import { CertificateExpandedRow } from './CertificateExpandedRow'
import * as styles from './CertificatesTable.css'

interface Props {
  certificates: ShipRegistryCertificate[]
  loading: boolean
}

export const CertificatesTable = ({ certificates, loading }: Props) => {
  const { formatMessage, locale } = useLocale()
  const [search, setSearch] = useState('')
  const [collapsingRows, setCollapsingRows] = useState<Set<string>>(new Set())

  const columns = useMemo<Column<ShipRegistryCertificate>[]>(
    () => [
      {
        id: 'expander',
        Header: () => null,
      },
      {
        Header: formatMessage(shipsMessages.certificatesType),
        accessor: 'name',
      },
      {
        Header: formatMessage(shipsMessages.certificatesExpiry),
        accessor: 'validToDate',
        Cell: ({ value }) => (value ? formatDate(new Date(value)) : '-'),
      },
      {
        id: 'status',
        Header: formatMessage(shipsMessages.certificatesStatus),
        accessor: 'status',
        Cell: ({ value }) =>
          value !== ShipRegistryCertificateStatus.Unknown ? (
            <Tag
              outlined
              variant={
                value === ShipRegistryCertificateStatus.Invalid
                  ? 'red'
                  : value === ShipRegistryCertificateStatus.ReinspectionNeeded ||
                    value === ShipRegistryCertificateStatus.InInspectionWindow
                  ? 'yellow'
                  : 'mint'
              }
            >
              {value === ShipRegistryCertificateStatus.Invalid
                ? formatMessage(shipsMessages.invalidTag)
                : value === ShipRegistryCertificateStatus.ReinspectionNeeded
                ? formatMessage(shipsMessages.reinspectionNeededTag)
                : value === ShipRegistryCertificateStatus.InInspectionWindow
                ? formatMessage(shipsMessages.inInspectionWindowTag)
                : formatMessage(shipsMessages.validTag)}
            </Tag>
          ) : null,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  const filteredCertificates = useMemo(
    () =>
      search
        ? certificates.filter((c) =>
            c.name?.toLowerCase().includes(search.toLowerCase()),
          )
        : certificates,
    [certificates, search],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredCertificates }, useExpanded)

  return (
    <Box marginTop={4}>
      <Box marginBottom={3} style={{ maxWidth: 318 }}>
        <Input
          name="cert-search"
          aria-label={formatMessage(shipsMessages.certificatesSearchPlaceholder)}
          placeholder={formatMessage(
            shipsMessages.certificatesSearchPlaceholder,
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="sm"
          backgroundColor="blue"
        />
      </Box>

      {loading ? (
        <EmptyTable loading />
      ) : !filteredCertificates.length ? (
        <EmptyTable message={formatMessage(shipsMessages.certificatesEmpty)} />
      ) : (
        <T.Table {...getTableProps()}>
          <T.Head>
            {headerGroups.map((headerGroup) => {
              const { key: headerKey, ...headerProps } =
                headerGroup.getHeaderGroupProps()
              return (
                <T.Row key={headerKey} {...headerProps}>
                  {headerGroup.headers.map((column, i) => {
                    const { key: columnKey, ...columnProps } =
                      column.getHeaderProps()
                    return (
                      <T.HeadData
                        key={columnKey}
                        {...columnProps}
                        align={i === 3 ? 'right' : 'left'}
                      >
                        {column.render('Header')}
                      </T.HeadData>
                    )
                  })}
                </T.Row>
              )
            })}
          </T.Head>
          <T.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              const { key: rowKey, ...rowProps } = row.getRowProps()
              return (
                <Fragment key={row.id}>
                  <T.Row key={rowKey} {...rowProps}>
                    {row.cells.map((cell, i) => {
                      const { key: cellKey, ...cellProps } = cell.getCellProps()
                      return i === 0 ? (
                        <T.Data
                          key={cellKey}
                          {...cellProps}
                          box={{ position: 'relative' }}
                        >
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {((row as any).isExpanded ||
                            collapsingRows.has(row.id)) && (
                            <div className={styles.line} />
                          )}
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Button
                              circle
                              colorScheme="light"
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              icon={(row as any).isExpanded ? 'remove' : 'add'}
                              iconType="filled"
                              size="small"
                              type="button"
                              variant="primary"
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              {...(row as any).getToggleRowExpandedProps()}
                              aria-label={
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (row as any).isExpanded
                                  ? formatMessage(shipsMessages.collapseRow)
                                  : formatMessage(shipsMessages.expandRow)
                              }
                              onClick={(e: React.MouseEvent) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                if ((row as any).isExpanded) {
                                  setCollapsingRows((prev) => {
                                    const next = new Set(prev)
                                    next.add(row.id)
                                    return next
                                  })
                                }
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ;(row as any)
                                  .getToggleRowExpandedProps()
                                  .onClick(e)
                              }}
                            />
                          </Box>
                        </T.Data>
                      ) : (
                        <T.Data key={cellKey} {...cellProps}>
                          {cell.render('Cell')}
                        </T.Data>
                      )
                    })}
                  </T.Row>
                  <T.Row>
                    <T.Data
                      colSpan={4}
                      style={{ padding: 0 }}
                      box={{ position: 'relative' }}
                    >
                      <AnimateHeight
                        duration={300}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        height={(row as any).isExpanded ? 'auto' : 0}
                        onHeightAnimationEnd={(newHeight) => {
                          if (newHeight === 0) {
                            setCollapsingRows((prev) => {
                              const next = new Set(prev)
                              next.delete(row.id)
                              return next
                            })
                          }
                        }}
                      >
                        <div className={styles.line} />
                        <CertificateExpandedRow
                          issueDate={row.original.issueDate}
                          extensionDate={row.original.extensionDate}
                        />
                      </AnimateHeight>
                    </T.Data>
                  </T.Row>
                </Fragment>
              )
            })}
          </T.Body>
        </T.Table>
      )}
    </Box>
  )
}
