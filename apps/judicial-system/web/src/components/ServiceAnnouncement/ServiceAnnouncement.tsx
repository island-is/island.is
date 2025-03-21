import { FC, useContext, useEffect, useState } from 'react'
import { IntlShape, MessageDescriptor, useIntl } from 'react-intl'

import { AlertMessage, Box, LoadingDots, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { type Lawyer } from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  ServiceStatus,
  Subpoena,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useSubpoena } from '../../utils/hooks'
import { LawyerRegistryContext } from '../LawyerRegistryProvider/LawyerRegistryProvider'
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
        `${subpoena.servedBy ? subpoena.servedBy : ''}${
          subpoena.serviceDate
            ? ` - ${formatDate(subpoena.serviceDate, 'Pp')}`
            : ''
        }`,
        formatMessage(strings.servedToDefender, {
          lawyerName: lawyer?.name,
          practice: lawyer?.practice,
        }),
      ]
    case ServiceStatus.ELECTRONICALLY:
      return [
        formatMessage(strings.servedToElectronically, {
          date: subpoena.serviceDate
            ? formatDate(subpoena.serviceDate, 'Pp')
            : '',
        }),
      ]
    case ServiceStatus.IN_PERSON:
    case ServiceStatus.FAILED:
      return [
        `${subpoena.servedBy ? subpoena.servedBy : ''}${
          subpoena.serviceDate
            ? ` - ${formatDate(subpoena.serviceDate, 'Pp')}`
            : ''
        }`,
        subpoena.comment,
      ]
    case ServiceStatus.EXPIRED:
      return [formatMessage(strings.serviceStatusExpiredMessage)]
    default:
      return [
        formatMessage(strings.subpoenaCreated, {
          date: subpoena.created ? formatDate(subpoena.created, 'Pp') : '',
        }),
      ]
  }
}

const renderError = (formatMessage: IntlShape['formatMessage']) => (
  <AlertMessage
    type="error"
    title={formatMessage(errors.getSubpoenaStatusTitle)}
    message={formatMessage(errors.getSubpoenaStatus)}
  />
)

interface ServiceAnnouncementProps {
  subpoena: Subpoena
  defendantName?: string | null
}

const ServiceAnnouncement: FC<ServiceAnnouncementProps> = (props) => {
  const { subpoena: localSubpoena, defendantName } = props
  const [lawyer, setLawyer] = useState<Lawyer>()

  const { subpoena, subpoenaLoading } = useSubpoena(localSubpoena)

  const { formatMessage } = useIntl()

  const { lawyers } = useContext(LawyerRegistryContext)

  const title = mapServiceStatusTitle(subpoena?.serviceStatus)
  const messages = subpoena
    ? mapServiceStatusMessages(subpoena, formatMessage, lawyer)
    : []

  useEffect(() => {
    if (
      !subpoena?.defenderNationalId ||
      subpoena?.serviceStatus !== ServiceStatus.DEFENDER ||
      !lawyers ||
      lawyers.length === 0
    ) {
      return
    }

    setLawyer(
      lawyers.find(
        (lawyer) => lawyer.nationalId === subpoena.defenderNationalId,
      ),
    )
  }, [lawyers, subpoena?.defenderNationalId, subpoena?.serviceStatus])

  return subpoenaLoading ? (
    <Box display="flex" justifyContent="center" paddingY={5}>
      <LoadingDots />
    </Box>
  ) : !subpoena ? (
    <Box marginBottom={2}>{renderError(formatMessage)}</Box>
  ) : (
    <Box marginBottom={2}>
      <AlertMessage
        title={`${formatMessage(title)}${
          defendantName && subpoena.serviceStatus ? ` - ${defendantName}` : ''
        }`}
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
          !subpoena?.serviceStatus
            ? 'info'
            : subpoena?.serviceStatus === ServiceStatus.FAILED ||
              subpoena?.serviceStatus === ServiceStatus.EXPIRED
            ? 'warning'
            : 'success'
        }
      />
    </Box>
  )
}

export default ServiceAnnouncement
