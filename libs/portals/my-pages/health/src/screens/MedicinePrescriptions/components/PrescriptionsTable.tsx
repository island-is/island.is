import {
  HealthDirectoratePrescription,
  HealthDirectoratePrescriptionRenewalStatus,
} from '@island.is/api/schema'
import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  createColumnHelper,
  ellipsis,
  formatDate,
  PortalTable,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import React, { useMemo, useState } from 'react'
import MobileLabeledCell from '../../../components/MobileLabeledCell/MobileLabeledCell'
import { messages } from '../../../lib/messages'
import { tableTextCell } from '../../../components/TableTextCell/TableTextCell'
import { mapBlockedStatus } from '../../../utils/mappers'
import { PrescriptionItem } from '../../../utils/types'
import PrescriptionDetails from './PrescriptionDetails'
import RenewPrescriptionModal from './RenewPrescriptionModal/RenewPrescriptionModal'

const STRING_MAX_LENGTH = 22

// Tighter than the table default so the columns fit without scrolling sideways
const CELL_BOX = { paddingLeft: 2, paddingRight: 2 } as const

const renewalStatusMessageMap: Record<
  HealthDirectoratePrescriptionRenewalStatus,
  keyof typeof messages
> = {
  [HealthDirectoratePrescriptionRenewalStatus.Approved]:
    'renewalStatusApproved',
  [HealthDirectoratePrescriptionRenewalStatus.Rejected]:
    'renewalStatusRejected',
  [HealthDirectoratePrescriptionRenewalStatus.Dismissed]:
    'renewalStatusDismissed',
  [HealthDirectoratePrescriptionRenewalStatus.Unknown]: 'renewalStatusUnknown',
  [HealthDirectoratePrescriptionRenewalStatus.Pending]: 'renewalInProgress',
}

interface Props {
  data?: HealthDirectoratePrescription[]
  loading?: boolean
}

const columnHelper = createColumnHelper<HealthDirectoratePrescription>()

const PrescriptionsTable: React.FC<Props> = ({ data, loading }) => {
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
  const [activePrescription, setActivePrescription] =
    useState<PrescriptionItem | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const columns = useMemo(() => {
    return [
      columnHelper.accessor(
        (item) => [item.name, item.strength].filter(Boolean).join(' '),
        {
          id: 'medicine',
          header: formatMessage(messages.medicineTitle),
          meta: { type: 'interactive' },
          cell: ({ getValue, row }) =>
            isMobile ? (
              <Text variant="h4" as="h2" color="blue400">
                {getValue()}
              </Text>
            ) : (
              <>
                <Text variant="medium" as="span" whiteSpace="nowrap">
                  {ellipsis(getValue(), STRING_MAX_LENGTH)}
                </Text>
                {row.original.dosageInstructions && (
                  <Text variant="small">{row.original.dosageInstructions}</Text>
                )}
              </>
            ),
        },
      ),
      columnHelper.accessor((item) => item.indication ?? '', {
        id: 'usedFor',
        header: formatMessage(messages.usedFor),
        meta: { type: 'interactive' },
        cell: ({ getValue }) =>
          tableTextCell(
            isMobile ? getValue() : ellipsis(getValue(), STRING_MAX_LENGTH),
          ),
      }),
      columnHelper.accessor((item) => item.amountRemaining ?? '', {
        id: 'process',
        header: formatMessage(messages.process),
        meta: { type: 'interactive' },
        cell: ({ getValue }) => tableTextCell(getValue()),
      }),
      columnHelper.accessor((item) => item.expiryDate ?? '', {
        id: 'validTo',
        header: formatMessage(messages.medicineValidTo),
        meta: { type: 'interactive' },
        cell: ({ row }) => {
          const { expiryDate } = row.original
          const isExpired = expiryDate
            ? new Date(expiryDate) < new Date()
            : false
          return isExpired ? (
            <Tag variant="red" disabled outlined>
              {formatMessage(messages.expired)}
            </Tag>
          ) : (
            tableTextCell(formatDate(expiryDate) ?? '')
          )
        },
      }),
      columnHelper.display({
        id: 'status',
        header: formatMessage(messages.renewal),
        // span: 2 only applies on mobile, where the cell takes the full card width without a label
        meta: { type: 'interactive', span: 2 },
        cell: ({ row }) => {
          const item = row.original
          if (!item.renewalStatus && item.isRenewable) {
            const button = (
              <Button
                variant={isMobile ? 'ghost' : 'text'}
                type="button"
                size="small"
                icon="reload"
                iconType="outline"
                fluid={isMobile}
                onClick={() => {
                  setActivePrescription(item)
                  setOpenModal(true)
                }}
              >
                {formatMessage(messages.renew)}
              </Button>
            )
            return isMobile ? <Box marginTop={2}>{button}</Box> : button
          }
          const status = tableTextCell(
            item.renewalStatus
              ? formatMessage(
                  messages[renewalStatusMessageMap[item.renewalStatus]],
                )
              : mapBlockedStatus(
                  item.renewalBlockedReason?.toString() ?? '',
                  formatMessage,
                )?.status ?? '',
          )
          // The full width cell has no label on mobile, so add it to match the other rows
          return isMobile ? (
            <MobileLabeledCell label={formatMessage(messages.renewal)}>
              {status}
            </MobileLabeledCell>
          ) : (
            status
          )
        },
      }),
    ]
  }, [formatMessage, isMobile])

  return (
    <>
      <PortalTable
        columns={columns}
        data={data ?? []}
        loading={loading}
        emptyMessage={formatMessage(messages.noSearchResults)}
        getRowId={(item) => item.id}
        defaultSorting={[{ id: 'medicine', desc: false }]}
        mobileTitleKey="medicine"
        cellBox={{ header: CELL_BOX, body: CELL_BOX }}
        renderExpandedRow={(row) => <PrescriptionDetails item={row.original} />}
      />

      {activePrescription && (
        <RenewPrescriptionModal
          id={`renewPrescriptionModal-${activePrescription.id}`}
          activePrescription={activePrescription}
          toggleClose={openModal}
          isVisible={openModal}
          setVisible={(visible: boolean) => setOpenModal(visible)}
          setActivePrescription={(prescription: PrescriptionItem | null) =>
            setActivePrescription(prescription)
          }
        />
      )}
    </>
  )
}

export default PrescriptionsTable
