import { useMemo, useState } from 'react'
import {
  ShipRegistryCertificate,
  ShipRegistryCertificateStatus,
} from '@island.is/api/schema'
import { Box, Input, Tag } from '@island.is/island-ui/core'
import type { Row } from '@island.is/portals/my-pages/core'
import {
  Table,
  createColumnHelper,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { shipsMessages } from '../../../../lib/messages'
import { CertificateExpandedRow } from './CertificateExpandedRow'

interface Props {
  certificates: ShipRegistryCertificate[]
  loading: boolean
}

const columnHelper = createColumnHelper<ShipRegistryCertificate>()

export const CertificatesTable = ({ certificates, loading }: Props) => {
  const { formatMessage, locale } = useLocale()
  const [search, setSearch] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: formatMessage(shipsMessages.certificatesType),
      }),
      columnHelper.accessor('validToDate', {
        header: formatMessage(shipsMessages.certificatesExpiry),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(new Date(value)) : '-'
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: formatMessage(shipsMessages.certificatesStatus),
        enableSorting: false,
        cell: ({ getValue }) => {
          const value = getValue()
          if (value === ShipRegistryCertificateStatus.Unknown) return null
          return (
            <Tag
              outlined
              variant={
                value === ShipRegistryCertificateStatus.Invalid
                  ? 'red'
                  : value ===
                      ShipRegistryCertificateStatus.ReinspectionNeeded ||
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
          )
        },
      }),
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

  const renderExpandedRow = (row: Row<ShipRegistryCertificate>) => (
    <CertificateExpandedRow
      issueDate={row.original.issueDate}
      extensionDate={row.original.extensionDate}
    />
  )

  return (
    <Box marginTop={4}>
      <Box marginBottom={3} style={{ maxWidth: 318 }}>
        <Input
          name="cert-search"
          aria-label={formatMessage(
            shipsMessages.certificatesSearchPlaceholder,
          )}
          placeholder={formatMessage(
            shipsMessages.certificatesSearchPlaceholder,
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="sm"
          backgroundColor="blue"
        />
      </Box>
      <Table
        columns={columns}
        data={filteredCertificates}
        loading={loading}
        emptyMessage={formatMessage(shipsMessages.certificatesEmpty)}
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}
