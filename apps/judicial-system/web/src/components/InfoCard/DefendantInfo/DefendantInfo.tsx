import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  Defendant,
  ServiceRequirement,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
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
  defender?: Defender
}

export const getAppealExpirationInfo = (
  verdictAppealDeadline?: string | null,
  isVerdictAppealDeadlineExpired?: boolean | null,
  serviceRequirement?: ServiceRequirement | null,
) => {
  if (serviceRequirement === ServiceRequirement.NOT_REQUIRED) {
    return { message: strings.serviceRequirementNotRequired, data: null }
  }

  if (!verdictAppealDeadline) {
    return { message: strings.appealDateNotBegun, date: null }
  }

  const expiryDate = new Date(verdictAppealDeadline)

  const message = isVerdictAppealDeadlineExpired
    ? strings.appealDateExpired
    : strings.appealExpirationDate

  return { message, date: formatDate(expiryDate) }
}

export const DefendantInfo: FC<DefendantInfoProps> = (props) => {
  const {
    defendant,
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    defender,
  } = props
  const { formatMessage } = useIntl()

  const appealExpirationInfo = getAppealExpirationInfo(
    defendant.verdictAppealDeadline,
    defendant.isVerdictAppealDeadlineExpired,
    defendant.serviceRequirement,
  )

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
      {defendant.defenderName || defender?.name ? (
        <Box component="p">
          <Text as="span" whiteSpace="pre" fontWeight="semiBold">
            {defender?.sessionArrangement ===
            SessionArrangements.ALL_PRESENT_SPOKESPERSON
              ? `${formatMessage(strings.spokesperson)}: `
              : `${formatMessage(strings.defender)}: `}
          </Text>
          {RenderPersonalData(
            defendant.defenderName || defender?.name,
            defendant.defenderEmail || defender?.email,
            defendant.defenderPhoneNumber || defender?.phoneNumber,
            false,
          )}
        </Box>
      ) : (
        <Text>{`${formatMessage(strings.defender)}: ${formatMessage(
          strings.noDefender,
        )}`}</Text>
      )}
      {displayAppealExpirationInfo && (
        <Box>
          <Text as="span">
            {formatMessage(appealExpirationInfo.message, {
              appealExpirationDate: appealExpirationInfo.date,
            })}
          </Text>
        </Box>
      )}
      {displayVerdictViewDate && (
        <Text>
          {formatMessage(strings.verdictDisplayedDate, {
            date: formatDate(defendant.verdictViewDate, 'PPP'),
          })}
        </Text>
      )}
    </>
  )
}
