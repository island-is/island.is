import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  Defendant,
  ServiceRequirement,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
import {
  getAppealExpirationInfo,
  getVerdictViewDateText,
} from './DefendantInfo.logic'
import { strings as infoCardStrings } from '../useInfoCardItems.strings'
import { strings } from './DefendantInfo.strings'

interface Defender {
  name?: string | null
  defenderNationalId?: string | null
  sessionArrangement?: SessionArrangements | null
  email?: string | null
  phoneNumber?: string | null
}

interface DefendantInfoProps {
  defendant: Defendant
  displayAppealExpirationInfo?: boolean
  displayVerdictViewDate?: boolean
  displaySentToPrisonAdminDate?: boolean
  defender?: Defender
}

export const DefendantInfo: FC<DefendantInfoProps> = (props) => {
  const {
    defendant,
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    displaySentToPrisonAdminDate = true,
    defender,
  } = props
  const { formatMessage } = useIntl()
  const hasDefender = defendant.defenderName || defender?.name
  const defenderLabel =
    defender?.sessionArrangement ===
    SessionArrangements.ALL_PRESENT_SPOKESPERSON
      ? formatMessage(strings.spokesperson)
      : formatMessage(strings.defender)
  const defenderName = defendant.defenderName || defender?.name
  const defenderEmail = defendant.defenderEmail || defender?.email
  const defenderPhoneNumber =
    defendant.defenderPhoneNumber || defender?.phoneNumber

  const appealExpirationInfo = getAppealExpirationInfo({
    verdictAppealDeadline: defendant.verdictAppealDeadline,
    isVerdictAppealDeadlineExpired: defendant.isVerdictAppealDeadlineExpired,
    serviceRequirement: defendant.verdict?.serviceRequirement,
  })

  return (
    <>
      <Box component="p" marginBottom={1}>
        <Text as="span" fontWeight="semiBold">{`${formatMessage(
          infoCardStrings.name,
        )}: `}</Text>
        <Text as="span">
          {defendant.name}
          {defendant.nationalId &&
            `, ${formatDOB(defendant.nationalId, defendant.noNationalId)}`}
          {defendant.citizenship && `, (${defendant.citizenship})`}
        </Text>
      </Box>
      <Box component="p" marginBottom={1}>
        <Text as="span" fontWeight="semiBold">{`${formatMessage(
          core.addressOrResidence,
        )}: `}</Text>
        <Text as="span">
          {defendant.address ? defendant.address : 'Ekki skráð'}
        </Text>
      </Box>
      <Box component="p">
        <Text as="span" whiteSpace="pre" fontWeight="semiBold">
          {`${defenderLabel}: `}
        </Text>
        {hasDefender ? (
          RenderPersonalData(
            defenderName,
            defenderEmail,
            defenderPhoneNumber,
            false,
          )
        ) : (
          <Text as="span">{formatMessage(strings.noDefender)}</Text>
        )}
      </Box>
      {displayAppealExpirationInfo && (
        <Text as="p" marginTop={1} fontWeight="semiBold">
          {formatMessage(appealExpirationInfo.message, {
            appealExpirationDate: appealExpirationInfo.date,
            deadlineType: defendant.verdict?.isDefaultJudgement
              ? 'Endurupptökufrestur'
              : 'Áfrýjunarfrestur',
          })}
        </Text>
      )}
      {displayVerdictViewDate &&
        defendant.verdict?.serviceRequirement &&
        defendant.verdict?.serviceRequirement !==
          ServiceRequirement.NOT_REQUIRED && (
          <Text marginTop={1} fontWeight="semiBold">
            {getVerdictViewDateText(
              formatMessage,
              defendant.verdict?.serviceDate,
            )}
          </Text>
        )}
      {displaySentToPrisonAdminDate && defendant.sentToPrisonAdminDate && (
        <Text marginTop={1} fontWeight="semiBold">
          {formatMessage(strings.sendToPrisonAdminDate, {
            date: formatDate(defendant.sentToPrisonAdminDate, 'PPP'),
          })}
        </Text>
      )}
    </>
  )
}
