import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
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
import * as styles from './DefendantInfo.css'

interface Defender {
  name?: string | null
  defenderNationalId?: string | null
  sessionArrangement?: SessionArrangements | null
  email?: string | null
  phoneNumber?: string | null
}

export type DefendantInfoActionButton = {
  text: string
  onClick: (defendant: Defendant) => void
  icon?: IconMapIcon
  isDisabled: (defendant: Defendant) => boolean
}

interface DefendantInfoProps {
  defendant: Defendant
  displayAppealExpirationInfo?: boolean
  defendantInfoActionButton?: DefendantInfoActionButton
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
    defendantInfoActionButton,
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
    <div
      className={
        defendantInfoActionButton
          ? styles.gridRow.withButton
          : styles.gridRow.withoutButton
      }
    >
      <div className={styles.infoCardDefendant}>
        <Box marginBottom={1}>
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
        <Box marginBottom={1}>
          <Text as="span" fontWeight="semiBold">{`${formatMessage(
            core.addressOrResidence,
          )}: `}</Text>
          <Text as="span">
            {defendant.address ? defendant.address : 'Ekki skráð'}
          </Text>
        </Box>
        {defendant.defenderName || defender?.name ? (
          <Box display={['block', 'block', 'block', 'flex']}>
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
      </div>
      {defendantInfoActionButton && (
        <Box>
          <Button
            variant="text"
            size="small"
            onClick={() => defendantInfoActionButton.onClick(defendant)}
            icon={defendantInfoActionButton.icon}
            iconType="outline"
            disabled={defendantInfoActionButton.isDisabled(defendant)}
          >
            {defendantInfoActionButton.text}
          </Button>
        </Box>
      )}
    </div>
  )
}
