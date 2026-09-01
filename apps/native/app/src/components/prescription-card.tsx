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
  description: string
  // Whether the prescription itself is still valid (positive state).
  isValid: boolean
  // Whether the description should surface in the info alert box.
  showReason: boolean
}

// Mirrors the web portal's mapBlockedStatus (libs/portals/my-pages/health).
const getBlockedReasonInfo = (
  reason: HealthDirectoratePrescriptionRenewalBlockedReason | null | undefined,
  intl: IntlShape,
): BlockedReasonInfo => {
  const Reason = HealthDirectoratePrescriptionRenewalBlockedReason
  const describe = (id: string) => intl.formatMessage({ id })
  switch (reason) {
    case Reason.IsRegiment:
      return {
        description: describe('health.prescriptions.renewalBlockedIsRegiment'),
        isValid: false,
        showReason: true,
      }
    case Reason.NoMedCard:
      return {
        description: describe('health.prescriptions.renewalBlockedNoMedCard'),
        isValid: false,
        showReason: true,
      }
    case Reason.NoHealthClinic:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedNoHealthClinic',
        ),
        isValid: false,
        showReason: true,
      }
    case Reason.NotFullyDispensed:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedNotFullyDispensed',
        ),
        isValid: true,
        showReason: false,
      }
    case Reason.PendingRequest:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedPendingRequest',
        ),
        isValid: false,
        showReason: false,
      }
    case Reason.RejectedRequest:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedRejectedRequest',
        ),
        isValid: false,
        showReason: false,
      }
    case Reason.DismissedRequest:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedDismissedRequest',
        ),
        isValid: false,
        showReason: true,
      }
    case Reason.AlreadyRequested:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedAlreadyRequested',
        ),
        isValid: false,
        showReason: false,
      }
    case Reason.MoreRecentPrescriptionExists:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedMoreRecentExists',
        ),
        isValid: false,
        showReason: true,
      }
    case Reason.SpecialistOnlyPrescription:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedSpecialistOnly',
        ),
        isValid: false,
        showReason: true,
      }
    case Reason.NoRenewalTargets:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedNoRenewalTargets',
        ),
        isValid: false,
        showReason: true,
      }
    case Reason.InvalidRenewalTarget:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedInvalidRenewalTarget',
        ),
        isValid: false,
        showReason: true,
      }
    case Reason.RecipientExcludesAtc:
      return {
        description: describe(
          'health.prescriptions.renewalBlockedRecipientExcludesAtc',
        ),
        isValid: false,
        showReason: true,
      }
    default:
      return {
        description: describe('health.prescriptions.renewalBlockedOther'),
        isValid: false,
        showReason: true,
      }
  }
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

  // Renewal presentation, mirroring the web portal's decision order:
  // renewalStatus wins → else renewable shows the action → else blocked reason.
  const canRenew = !!prescription.isRenewable && !prescription.renewalStatus
  const renewalInfo = ((): { statusLabel: string; alertMessage?: string } => {
    if (prescription.renewalStatus) {
      const isValid =
        prescription.renewalStatus ===
        HealthDirectoratePrescriptionRenewalStatus.Approved
      return {
        statusLabel: intl.formatMessage({
          id: isValid
            ? 'health.prescriptions.renewalValid'
            : 'health.prescriptions.renewalNotAvailable',
        }),
        alertMessage: prescription.renewResponseMessage ?? undefined,
      }
    }
    const blocked = getBlockedReasonInfo(
      prescription.renewalBlockedReason,
      intl,
    )
    return {
      statusLabel: intl.formatMessage({
        id: blocked.isValid
          ? 'health.prescriptions.renewalValid'
          : 'health.prescriptions.renewalNotAvailable',
      }),
      alertMessage:
        blocked.showReason || prescription.renewResponseMessage
          ? prescription.renewResponseMessage || blocked.description
          : undefined,
    }
  })()

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
      <Typography variant="body3">{renewalInfo.statusLabel}</Typography>
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
        {renewalInfo.alertMessage ? (
          <View style={{ marginBottom: theme.spacing[2] }}>
            <Alert type="info" hasBorder message={renewalInfo.alertMessage} />
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
