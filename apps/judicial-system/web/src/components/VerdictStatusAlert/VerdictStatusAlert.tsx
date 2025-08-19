import { AlertMessage, Text, Box } from '@island.is/island-ui/core'
import { ServiceStatus, Verdict } from '../../graphql/schema'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Lawyer } from '@island.is/judicial-system/types'

const mapServiceStatusTitle = (
  serviceStatus?: ServiceStatus | null,
): string => {
  switch (serviceStatus) {
    case ServiceStatus.DEFENDER:
    case ServiceStatus.ELECTRONICALLY:
    case ServiceStatus.IN_PERSON:
      return 'Birting tókst'
    case ServiceStatus.EXPIRED:
      return 'remove?'
    case ServiceStatus.FAILED:
      return 'remove?'
    // Should not happen
    default:
      return 'Óþekkt birtingarstaða'
  }
}

const mapServiceStatusMessages = (verdict: Verdict, lawyer?: Lawyer) => {
  switch (verdict.serviceStatus) {
    case ServiceStatus.DEFENDER:
      return ['not implemented']
    case ServiceStatus.ELECTRONICALLY:
      return [
        `Rafrænt pósthólf island.is - ${
          verdict.serviceDate ? formatDate(verdict.serviceDate, 'Pp') : ''
        }`,
      ]
    case ServiceStatus.IN_PERSON:
    case ServiceStatus.FAILED:
      return [
        `${verdict.servedBy ? verdict.servedBy : ''}${
          verdict.serviceDate
            ? ` - ${formatDate(verdict.serviceDate, 'Pp')}`
            : ''
        }`,
        verdict.comment,
      ]
    default:
      return [
        `Ákæra fór í birtingu ${
          verdict.created ? formatDate(verdict.created, 'Pp') : ''
        }`,
      ]
  }
}

const VerdictStatusAlert = ({ verdict }: { verdict: Verdict }) => {
  const title = mapServiceStatusTitle(verdict.serviceStatus)
  const messages = mapServiceStatusMessages(verdict)

  const isServed =
    verdict.serviceDate &&
    verdict.serviceStatus &&
    [
      ServiceStatus.DEFENDER,
      ServiceStatus.ELECTRONICALLY,
      ServiceStatus.IN_PERSON,
    ].includes(verdict.serviceStatus)

  if (isServed) {
    return (
      <AlertMessage
        type="success"
        title={title}
        message={
          <Box>
            {messages.map((msg) => (
              <Text variant="small" key={`${msg}-${verdict.created}`}>
                {msg}
              </Text>
            ))}
          </Box>
        }
      />
    )
  }

  if (verdict.legalPaperRequestDate) {
    return (
      <AlertMessage
        type="success"
        title="Birting tókst"
        message={`Birt í Lögbirtingarblaðinu ${formatDate(
          verdict.legalPaperRequestDate,
          'Pp',
        )}`}
      />
    )
  }

  if (!verdict.externalPoliceDocumentId) {
    return (
      <AlertMessage
        type="info"
        title="Dómur er í birtingarferli"
        message={`Dómur fór í birtingu ${formatDate(verdict.created, 'Pp')}`}
      />
    )
  }

  return null
}

export default VerdictStatusAlert
