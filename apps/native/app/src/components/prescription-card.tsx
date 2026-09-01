import React, { useCallback, useRef, useState } from 'react'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import { ActivityIndicator, Image, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import chevronDown from '@/assets/icons/chevron-down.png'
import clockIcon from '@/assets/icons/clock.png'
import externalLinkIcon from '@/assets/icons/external-link.png'
import {
  HealthDirectoratePrescription,
  HealthDirectoratePrescriptionDocument,
  HealthDirectoratePrescriptionRenewalBlockedReason,
  HealthDirectoratePrescriptionRenewalStatus,
  useGetPrescriptionDocumentsLazyQuery,
} from '@/graphql/types/schema'
import { Alert, Button, ExpandableCard, Link, LinkText, Typography } from '@/ui'
import checkmarkIcon from '@/ui/assets/icons/check.png'
import { capitalizeEveryWord } from '@/utils/capitalize'

const TableRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-color: ${({ theme }) => theme.color.blue200};
  border-bottom-width: 1px;
`
const RowItem = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[1]}px;
  width: 40%;
  flex: 1;
`

const TableHeader = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const DispensationRowItem = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[1]}px;
`

const DispensationCheckmark = styled.View`
  max-width: 15%;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
`

const StatusPill = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.blue200};
  border-radius: ${({ theme }) => theme.border.radius.large};
  padding-vertical: ${({ theme }) => theme.spacing[1]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  align-items: center;
`

type PrescriptionRow = {
  data?: React.ReactNode
  label?: string
  labelText?: string
  url?: string
}

type PrescriptionCardProps = {
  prescription: HealthDirectoratePrescription
  onRenewPress?: () => void
}

type BlockedReasonInfo = {
  // The pill label to show for this blocked reason.
  status: string
  description: string
  // Whether the description should surface in the info alert box.
  showReason: boolean
}

// Mirrors the web portal's mapBlockedStatus (libs/portals/my-pages/health):
// same per-reason status label + showReason flag, so behaviour stays in parity.
const getBlockedReasonInfo = (
  reason: HealthDirectoratePrescriptionRenewalBlockedReason | null | undefined,
  intl: IntlShape,
): BlockedReasonInfo => {
  const Reason = HealthDirectoratePrescriptionRenewalBlockedReason
  const describe = (id: string) => intl.formatMessage({ id })
  const notAvailable = describe('health.prescriptions.renewalNotAvailable')
  const valid = describe('health.prescriptions.renewalValid')
  const processing = describe('health.prescriptions.renewalStatusPending')
  const rejected = describe('health.prescriptions.renewalStatusRejected')
  switch (reason) {
    case Reason.IsRegiment:
      return {
        status: notAvailable,
        description: describe('health.prescriptions.renewalBlockedIsRegiment'),
        showReason: true,
      }
    case Reason.NoMedCard:
      return {
        status: notAvailable,
        description: describe('health.prescriptions.renewalBlockedNoMedCard'),
        showReason: true,
      }
    case Reason.NoHealthClinic:
      return {
        status: notAvailable,
        description: describe(
          'health.prescriptions.renewalBlockedNoHealthClinic',
        ),
        showReason: true,
      }
    case Reason.NotFullyDispensed:
      return {
        status: valid,
        description: describe(
          'health.prescriptions.renewalBlockedNotFullyDispensed',
        ),
        showReason: false,
      }
    case Reason.PendingRequest:
      return {
        status: processing,
        description: describe(
          'health.prescriptions.renewalBlockedPendingRequest',
        ),
        showReason: false,
      }
    case Reason.RejectedRequest:
      return {
        status: rejected,
        description: describe(
          'health.prescriptions.renewalBlockedRejectedRequest',
        ),
        showReason: false,
      }
    case Reason.DismissedRequest:
      return {
        status: notAvailable,
        description: describe(
          'health.prescriptions.renewalBlockedDismissedRequest',
        ),
        showReason: true,
      }
    case Reason.AlreadyRequested:
      return {
        status: processing,
        description: describe(
          'health.prescriptions.renewalBlockedAlreadyRequested',
        ),
        showReason: false,
      }
    case Reason.MoreRecentPrescriptionExists:
      return {
        status: notAvailable,
        description: describe(
          'health.prescriptions.renewalBlockedMoreRecentExists',
        ),
        showReason: true,
      }
    case Reason.SpecialistOnlyPrescription:
      return {
        status: notAvailable,
        description: describe(
          'health.prescriptions.renewalBlockedSpecialistOnly',
        ),
        showReason: true,
      }
    case Reason.NoRenewalTargets:
      return {
        status: notAvailable,
        description: describe(
          'health.prescriptions.renewalBlockedNoRenewalTargets',
        ),
        showReason: true,
      }
    case Reason.InvalidRenewalTarget:
      return {
        status: notAvailable,
        description: describe(
          'health.prescriptions.renewalBlockedInvalidRenewalTarget',
        ),
        showReason: true,
      }
    case Reason.RecipientExcludesAtc:
      return {
        status: notAvailable,
        description: describe(
          'health.prescriptions.renewalBlockedRecipientExcludesAtc',
        ),
        showReason: true,
      }
    default:
      return {
        status: notAvailable,
        description: describe('health.prescriptions.renewalBlockedOther'),
        showReason: true,
      }
  }
}

// Per-status renewal labels, mirroring the web portal's renewalStatusMessageMap
// (libs/portals/my-pages/health) so each status reads distinctly — notably
// Pending shows "in progress" rather than collapsing into "not available".
const renewalStatusMessageMap: Record<
  HealthDirectoratePrescriptionRenewalStatus,
  string
> = {
  [HealthDirectoratePrescriptionRenewalStatus.Approved]:
    'health.prescriptions.renewalStatusApproved',
  [HealthDirectoratePrescriptionRenewalStatus.Pending]:
    'health.prescriptions.renewalStatusPending',
  [HealthDirectoratePrescriptionRenewalStatus.Rejected]:
    'health.prescriptions.renewalStatusRejected',
  [HealthDirectoratePrescriptionRenewalStatus.Dismissed]:
    'health.prescriptions.renewalStatusDismissed',
  [HealthDirectoratePrescriptionRenewalStatus.Unknown]:
    'health.prescriptions.renewalStatusUnknown',
}

export const PrescriptionCard = ({
  prescription,
  onRenewPress,
}: PrescriptionCardProps) => {
  const intl = useIntl()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [documents, setDocuments] = useState<
    HealthDirectoratePrescriptionDocument[]
  >([])
  const hasFetchedDocuments = useRef(false)

  const [getDocuments, { loading: documentsLoading, error: documentsError }] =
    useGetPrescriptionDocumentsLazyQuery()

  const fetchDocuments = useCallback(async () => {
    if (hasFetchedDocuments.current || !prescription.productId) {
      return
    }
    hasFetchedDocuments.current = true
    try {
      const response = await getDocuments({
        variables: { input: { id: prescription.productId } },
      })
      // Apollo surfaces network/GraphQL errors via `response.error` rather than
      // rejecting, so reset the guard here too to allow a retry on re-expand.
      if (response.error) {
        hasFetchedDocuments.current = false
        return
      }
      setDocuments(
        response.data?.healthDirectoratePrescriptionDocuments?.documents ?? [],
      )
    } catch {
      // Allow a retry on the next expand if the request threw.
      hasFetchedDocuments.current = false
    }
  }, [getDocuments, prescription.productId])

  const isExpired =
    prescription.expiryDate && new Date(prescription.expiryDate) < new Date()

  // Renewal presentation, mirroring the web portal (PrescriptionsTable):
  // - the blocked reason is derived from isRenewable ALONE, independent of
  //   renewalStatus, so its description can surface in the box even when a
  //   status is present;
  // - the pill label prefers renewalStatus, else the blocked reason's label;
  // - the renew action shows only when renewable with no pending status.
  const canRenew = !!prescription.isRenewable && !prescription.renewalStatus
  const blocked = !prescription.isRenewable
    ? getBlockedReasonInfo(prescription.renewalBlockedReason, intl)
    : null
  const statusLabel = prescription.renewalStatus
    ? intl.formatMessage({
        id: renewalStatusMessageMap[prescription.renewalStatus],
      })
    : blocked?.status ?? ''
  const alertMessage =
    blocked?.showReason || prescription.renewResponseMessage
      ? prescription.renewResponseMessage || blocked?.description
      : undefined

  const attachmentRows: PrescriptionRow[] = documentsLoading
    ? [
        {
          labelText: intl.formatMessage(
            { id: 'health.prescriptions.attachment' },
            { arg: 1 },
          ),
          data: <ActivityIndicator size="small" color={theme.color.blue400} />,
        },
      ]
    : documentsError
    ? [
        {
          labelText: intl.formatMessage(
            { id: 'health.prescriptions.attachment' },
            { arg: 1 },
          ),
          data: intl.formatMessage({
            id: 'health.prescriptions.attachmentError',
          }),
        },
      ]
    : documents.map((document, index) => ({
        labelText: intl.formatMessage(
          { id: 'health.prescriptions.attachment' },
          { arg: index + 1 },
        ),
        data: intl.formatMessage(
          { id: 'health.prescriptions.openAttachment' },
          { arg: index + 1 },
        ),
        url: document.url,
      }))

  const prescriptionDataInformation: PrescriptionRow[] = [
    {
      data: prescription.name
        ? capitalizeEveryWord(prescription.name)
        : undefined,
      label: 'health.prescriptions.drug',
    },
    ...(canRenew
      ? [
          {
            data: intl.formatMessage({
              id: 'health.prescriptions.renewalPossible',
            }),
            label: 'health.prescriptions.renewal',
          },
        ]
      : []),
    {
      data: prescription.strength || undefined,
      label: 'health.prescriptions.strength',
    },
    {
      data: prescription.indication || undefined,
      label: 'health.prescriptions.indication',
    },
    {
      data: prescription.dosageInstructions,
      label: 'health.prescriptions.dosageInstructions',
    },
    ...attachmentRows,
    {
      data: prescription.type,
      label: 'health.prescriptions.type',
    },
    {
      data: prescription.form || undefined,
      label: 'health.prescriptions.form',
    },
    {
      data: prescription.totalPrescribedAmount || undefined,
      label: 'health.prescriptions.quantity',
    },
  ]

  const prescriptionDataIssuedBy: PrescriptionRow[] = [
    {
      data: prescription.issueDate
        ? intl.formatDate(prescription.issueDate)
        : undefined,
      label: 'health.prescriptions.issueDate',
    },
    {
      data: prescription.prescriberName,
      label: 'health.prescriptions.doctor',
    },
    {
      data: prescription.expiryDate
        ? intl.formatDate(prescription.expiryDate)
        : undefined,
      label: 'health.prescriptions.expiresAt',
    },
  ]

  const onPress = useCallback(() => {
    setOpen((isOpen) => {
      if (!isOpen) {
        void fetchDocuments()
      }
      return !isOpen
    })
  }, [fetchDocuments])

  // Always visible (collapsed + expanded): the renew action or the status pill.
  const renewalElement = canRenew ? (
    <Button
      isOutlined
      title={intl.formatMessage({ id: 'health.prescriptions.renew' })}
      onPress={onRenewPress}
      style={{ alignSelf: 'stretch' }}
    />
  ) : (
    <StatusPill>
      <Typography variant="body3">{statusLabel}</Typography>
    </StatusPill>
  )

  return (
    <ExpandableCard
      title={
        isExpired
          ? intl.formatMessage({
              id: 'health.prescriptionsAndCertificates.expired',
            })
          : prescription.expiryDate
          ? intl.formatMessage(
              { id: 'health.prescriptionsAndCertificates.validTo' },
              { date: intl.formatDate(prescription.expiryDate) },
            )
          : undefined
      }
      titleColor={isExpired ? theme.color.red600 : undefined}
      titleIcon={clockIcon}
      topRightValue={
        prescription?.amountRemaining && prescription?.amountRemaining
      }
      message={
        prescription.name ? capitalizeEveryWord(prescription.name) : undefined
      }
      icon={chevronDown}
      onPress={onPress}
      open={open}
      footer={renewalElement}
    >
      <View style={{ width: '100%', padding: theme.spacing[2] }}>
        {alertMessage ? (
          <View style={{ marginBottom: theme.spacing[2] }}>
            <Alert type="info" hasBorder message={alertMessage} />
          </View>
        ) : null}
        <View>
          <TableHeader>
            <Typography variant="eyebrow">
              <FormattedMessage id="health.prescriptionsAndCertificates.furtherInformation" />
            </Typography>
          </TableHeader>
          {prescriptionDataInformation
            .filter((item) => item.data)
            .map((item, visibleIndex) => (
              <TableRow
                key={visibleIndex}
                style={{
                  backgroundColor:
                    visibleIndex % 2 === 0
                      ? theme.color.blue100
                      : theme.color.white,
                }}
              >
                <RowItem>
                  <Typography variant="eyebrow">
                    {item.labelText ? (
                      item.labelText
                    ) : (
                      <FormattedMessage id={item.label} />
                    )}
                  </Typography>
                </RowItem>
                <RowItem>
                  {item.url ? (
                    <Link url={item.url}>
                      <LinkText variant="small" icon={externalLinkIcon}>
                        {item.data}
                      </LinkText>
                    </Link>
                  ) : typeof item.data === 'string' ? (
                    <Typography variant="body3">{item.data}</Typography>
                  ) : (
                    item.data
                  )}
                </RowItem>
              </TableRow>
            ))}
          {prescriptionDataIssuedBy.length && (
            <>
              <TableHeader style={{ marginTop: theme.spacing[3] }}>
                <Typography variant="eyebrow">
                  <FormattedMessage id="health.prescriptions.issueInformation" />
                </Typography>
              </TableHeader>
              {prescriptionDataIssuedBy
                .filter((item) => item.data)
                .map((item, visibleIndex) => (
                  <TableRow
                    key={visibleIndex}
                    style={{
                      backgroundColor:
                        visibleIndex % 2 === 0
                          ? theme.color.blue100
                          : theme.color.white,
                    }}
                  >
                    <RowItem>
                      <Typography variant="eyebrow">
                        {item.label && <FormattedMessage id={item.label} />}
                      </Typography>
                    </RowItem>
                    <RowItem>
                      <Typography variant="body3">{item.data}</Typography>
                    </RowItem>
                  </TableRow>
                ))}
            </>
          )}
          {!prescription?.dispensations?.length ? null : (
            <>
              <TableHeader style={{ marginTop: theme.spacing[3] }}>
                <Typography variant="eyebrow">
                  <FormattedMessage id="health.prescriptions.dispensations" />
                </Typography>
              </TableHeader>
              {prescription.dispensations.map((item, visibleIndex) => (
                <TableRow
                  key={visibleIndex}
                  style={{
                    backgroundColor:
                      visibleIndex % 2 === 0
                        ? theme.color.blue100
                        : theme.color.white,
                    paddingTop: theme.spacing[1],
                    paddingBottom: theme.spacing[1],
                  }}
                >
                  <DispensationRowItem>
                    <DispensationCheckmark>
                      <Image source={checkmarkIcon} />
                    </DispensationCheckmark>
                    <View>
                      <Typography variant="eyebrow">
                        {intl.formatMessage(
                          {
                            id: 'health.prescriptions.dispensationNumber',
                          },
                          { number: visibleIndex + 1 },
                        )}
                      </Typography>
                      <Typography variant="body3">
                        {`${intl.formatDate(item.date)}${
                          item.pharmacy ? ' - ' + item.pharmacy : ''
                        }${item.amount ? ' - ' + item.amount : ''}`}
                      </Typography>
                    </View>
                  </DispensationRowItem>
                </TableRow>
              ))}
            </>
          )}
        </View>
      </View>
    </ExpandableCard>
  )
}
