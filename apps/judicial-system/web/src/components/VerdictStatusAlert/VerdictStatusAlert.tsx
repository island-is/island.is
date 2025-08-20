import { useContext, useEffect, useState } from 'react'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Lawyer } from '@island.is/judicial-system/types'

import { Verdict,VerdictServiceStatus } from '../../graphql/schema'
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
    default:
      return [
        `Ákæra fór í birtingu ${
          verdict.created
            ? ` - ${formatDate(verdict.created)} kl. ${formatDate(
                verdict.created,
                TIME_FORMAT,
              )}`
            : ''
        }`,
      ]
  }
}

const VerdictStatusAlert = ({ verdict }: { verdict: Verdict }) => {
  const [lawyer, setLawyer] = useState<Lawyer>()
  const { lawyers } = useContext(LawyerRegistryContext)
  const messages = mapServiceStatusMessages(verdict, lawyer)
  const isServed = verdict.serviceDate && verdict.serviceStatus

  useEffect(() => {
    if (
      !verdict?.defenderNationalId ||
      verdict?.serviceStatus !== VerdictServiceStatus.DEFENDER ||
      !lawyers ||
      lawyers.length === 0
    ) {
      return
    }

    setLawyer(
      lawyers.find(
        (lawyer) => lawyer.nationalId === verdict.defenderNationalId,
      ),
    )
  }, [lawyers, verdict?.defenderNationalId, verdict?.serviceStatus])

  if (isServed) {
    return (
      <AlertMessage
        type="success"
        title="Birting tókst"
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
        message={`Birt í Lögbirtingarblaðinu - ${formatDate(
          verdict.legalPaperRequestDate,
        )} kl. ${formatDate(verdict.legalPaperRequestDate, TIME_FORMAT)}`}
      />
    )
  }

  if (!verdict.externalPoliceDocumentId) {
    return (
      <AlertMessage
        type="info"
        title="Dómur er í birtingarferli"
        message={`Dómur fór í birtingu ${formatDate(
          verdict.created,
        )} kl. ${formatDate(verdict.created, TIME_FORMAT)}`}
      />
    )
  }

  return null
}

export default VerdictStatusAlert
