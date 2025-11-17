import { useContext, useEffect, useState } from 'react'

import { AlertMessage, Box, LoadingDots, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Lawyer } from '@island.is/judicial-system/types'

import { Defendant, Verdict, VerdictServiceStatus } from '../../graphql/schema'
import useVerdict from '../../utils/hooks/useVerdict'
import { LawyerRegistryContext } from '../LawyerRegistryProvider/LawyerRegistryProvider'

const mapServiceStatusMessages = (verdict: Verdict, lawyer?: Lawyer) => {
  switch (verdict.serviceStatus) {
    case VerdictServiceStatus.DEFENDER:
      return [
        `${verdict.servedBy ? verdict.servedBy : ''}${
          verdict.serviceDate
            ? ` - ${formatDate(verdict.serviceDate)} kl. ${formatDate(
                verdict.serviceDate,
                TIME_FORMAT,
              )}`
            : ''
        }`,
        `Birt fyrir verjanda${
          lawyer ? ` - ${lawyer.name} ${lawyer.practice}` : ''
        }`,
      ]
    case VerdictServiceStatus.ELECTRONICALLY:
      return [
        `Rafrænt pósthólf island.is - ${
          verdict.serviceDate
            ? `${formatDate(verdict.serviceDate)} kl. ${formatDate(
                verdict.serviceDate,
                TIME_FORMAT,
              )}`
            : ''
        }`,
      ]
    case VerdictServiceStatus.IN_PERSON:
      return [
        `${verdict.servedBy ? verdict.servedBy : ''}${
          verdict.serviceDate
            ? ` - ${formatDate(verdict.serviceDate)} kl. ${formatDate(
                verdict.serviceDate,
                TIME_FORMAT,
              )}`
            : ''
        }`,
        verdict.comment,
      ]
    case VerdictServiceStatus.LEGAL_PAPER:
      return [
        `Dómur birtur í Lögbirtingarblaðinu - ${
          verdict.serviceDate ? `${formatDate(verdict.serviceDate)}` : ''
        }`,
      ]
    case VerdictServiceStatus.NOT_APPLICABLE:
      return [
        `Dómur birtur ${
          verdict.serviceDate
            ? ` - ${formatDate(verdict.serviceDate)} kl. ${formatDate(
                verdict.serviceDate,
                TIME_FORMAT,
              )}`
            : ''
        }`,
      ]
    default:
      return [
        `Dómur fór í birtingu ${
          verdict.verdictDeliveredToNationalCommissionersOffice
            ? ` - ${formatDate(
                verdict.verdictDeliveredToNationalCommissionersOffice,
              )} kl. ${formatDate(
                verdict.verdictDeliveredToNationalCommissionersOffice,
                TIME_FORMAT,
              )}`
            : ''
        }`,
      ]
  }
}
const VerdictStatusAlertMessage = ({
  defendantName,
  verdictDeliveredToNationalCommissionersOffice,
  verdict,
  lawyer,
}: {
  defendantName?: string
  verdictDeliveredToNationalCommissionersOffice?: string | null
  verdict: Verdict
  lawyer?: Lawyer
}) => {
  const messages = verdict ? mapServiceStatusMessages(verdict, lawyer) : []
  const isDeprecatedVerdict =
    verdict?.serviceStatus === VerdictServiceStatus.NOT_APPLICABLE &&
    !verdict.serviceDate

  if (isDeprecatedVerdict) return null

  const isServed = Boolean(verdict?.serviceDate && verdict?.serviceStatus)

  if (isServed) {
    if (verdict.serviceStatus === VerdictServiceStatus.LEGAL_PAPER) {
      return (
        <AlertMessage
          type="success"
          title={`Dómur birtur í Lögbirtingablaðinu - ${defendantName}`}
          message={messages[0]}
        />
      )
    }

    return (
      <AlertMessage
        type="success"
        title={`Dómur birtur - ${defendantName}`}
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

  if (
    verdictDeliveredToNationalCommissionersOffice &&
    verdict.externalPoliceDocumentId &&
    !verdict.serviceDate
  ) {
    return (
      <AlertMessage
        type="info"
        title={`Dómur er í birtingarferli - ${defendantName}`}
        message={`Dómur fór í birtingu ${formatDate(
          verdictDeliveredToNationalCommissionersOffice,
        )} kl. ${formatDate(
          verdictDeliveredToNationalCommissionersOffice,
          TIME_FORMAT,
        )}`}
      />
    )
  }

  return null
}

const VerdictStatusAlert = (props: {
  verdict: Verdict
  defendant: Defendant
}) => {
  const { verdict: currentVerdict, defendant } = props

  const [lawyer, setLawyer] = useState<Lawyer>()
  const { lawyers } = useContext(LawyerRegistryContext)
  const { verdict, verdictLoading } = useVerdict(currentVerdict)

  useEffect(() => {
    if (
      verdict?.serviceStatus !== VerdictServiceStatus.DEFENDER ||
      !lawyers ||
      lawyers.length === 0
    ) {
      return
    }

    const deliveredToDefenderNationalId =
      verdict.deliveredToDefenderNationalId ?? defendant.defenderNationalId

    setLawyer(
      lawyers.find(
        (lawyer) => lawyer.nationalId === deliveredToDefenderNationalId,
      ),
    )
  }, [
    lawyers,
    verdict?.deliveredToDefenderNationalId,
    verdict?.serviceStatus,
    defendant.defenderNationalId,
  ])

  return verdictLoading ? (
    <Box display="flex" justifyContent="center" paddingY={5}>
      <LoadingDots />
    </Box>
  ) : !verdict ? (
    <Box marginBottom={2}>
      <AlertMessage
        type="error"
        title="Ekki tókst að sækja stöðu birtingar"
        message="Vinsamlegast reyndu aftur síðar"
      />
    </Box>
  ) : (
    <VerdictStatusAlertMessage
      verdict={verdict}
      verdictDeliveredToNationalCommissionersOffice={
        currentVerdict?.verdictDeliveredToNationalCommissionersOffice
      }
      lawyer={lawyer}
      defendantName={defendant.name ?? ''}
    />
  )
}

export default VerdictStatusAlert
