import { FC } from 'react'
import { IntlShape, MessageDescriptor, useIntl } from 'react-intl'

import { AlertMessage, Box, LoadingDots, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { type Lawyer } from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  ServiceStatus,
  Subpoena,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useGetLawyer, useSubpoena } from '../../utils/hooks'
import { strings } from './ServiceAnnouncement.strings'

const mapServiceStatusTitle = (
  serviceStatus?: ServiceStatus | null,
): MessageDescriptor => {
  switch (serviceStatus) {
    case ServiceStatus.DEFENDER:
    case ServiceStatus.ELECTRONICALLY:
    case ServiceStatus.IN_PERSON:
      return strings.serviceStatusSuccess
    case ServiceStatus.EXPIRED:
      return strings.serviceStatusExpired
    case ServiceStatus.FAILED:
      return strings.serviceStatusFailed
    // Should not happen
    default:
      return strings.serviceStatusUnknown
  }
}

const mapServiceStatusMessages = (
  subpoena: Subpoena,
  formatMessage: IntlShape['formatMessage'],
  lawyer?: Lawyer,
) => {
  switch (subpoena.serviceStatus) {
    case ServiceStatus.DEFENDER:
      return [
        `${subpoena.servedBy} - ${formatDate(subpoena.serviceDate, 'Pp')}`,
        formatMessage(strings.servedToDefender, {
          lawyerName: lawyer?.name,
          practice: lawyer?.practice,
        }),
      ]
    case ServiceStatus.ELECTRONICALLY:
      return [
        formatMessage(strings.servedToElectronically, {
          date: formatDate(subpoena.serviceDate, 'Pp'),
        }),
      ]
    case ServiceStatus.IN_PERSON:
    case ServiceStatus.FAILED:
      return [
        `${subpoena.servedBy} - ${formatDate(subpoena.serviceDate, 'Pp')}`,
        subpoena.comment,
      ]
    case ServiceStatus.EXPIRED:
      return [formatMessage(strings.serviceStatusExpiredMessage)]
    default:
      return []
  }
}

const renderError = (formatMessage: IntlShape['formatMessage']) => (
  <AlertMessage
    type="error"
    title={formatMessage(errors.getSubpoenaStatusTitle)}
    message={formatMessage(errors.getSubpoenaStatus)}
  />
)

interface ServiceAnnouncement {
  subpoena: Subpoena
  defendantName?: string | null
}

const ServiceAnnouncement: FC<ServiceAnnouncement> = (props) => {
  const { subpoena, defendantName } = props

  const { subpoenaStatus, subpoenaStatusLoading, subpoenaStatusError } =
    useSubpoena(subpoena.caseId, subpoena.subpoenaId)

  const { formatMessage } = useIntl()

  const lawyer = useGetLawyer(
    subpoena.defenderNationalId,
    subpoena.serviceStatus === ServiceStatus.DEFENDER,
  )

  // Use data from RLS but fallback to local data
  const subpoenaServiceStatus = subpoenaStatusError
    ? subpoena.serviceStatus
    : subpoenaStatus?.subpoenaStatus?.serviceStatus

  if (!subpoenaServiceStatus && !subpoenaStatusLoading) {
    return <Box marginBottom={2}>{renderError(formatMessage)}</Box>
  }

  const title = mapServiceStatusTitle(subpoena.serviceStatus)
  const messages = mapServiceStatusMessages(subpoena, formatMessage, lawyer)

  return !defendantName ? null : subpoenaStatusLoading ? (
    <Box display="flex" justifyContent="center" paddingY={5}>
      <LoadingDots />
    </Box>
  ) : (
    <Box marginBottom={2}>
      <AlertMessage
        title={`${formatMessage(title)} - ${defendantName}`}
        message={
          <Box>
            {messages.map((msg) => (
              <Text variant="small" key={`${msg}-${subpoena.created}`}>
                {msg}
              </Text>
            ))}
          </Box>
        }
        type={
          subpoena.serviceStatus === ServiceStatus.FAILED ||
          subpoena.serviceStatus === ServiceStatus.EXPIRED
            ? 'warning'
            : 'success'
        }
      />
    </Box>
  )
}

export default ServiceAnnouncement
