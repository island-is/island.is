import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'
import {
  Defendant,
  ServiceRequirement,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { Defender } from '../InfoCard'
import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
import { strings } from './DefendantInfo.strings'
import * as styles from './DefendantInfo.css'

export type DefendantInfoActionButton = {
  text: string
  onClick: (defendant: Defendant) => void
  icon?: IconMapIcon
  isDisabled: (defendant: Defendant) => boolean
}

interface DefendantInfoProps {
  defendant: Defendant
  displayDefenderInfo: boolean
  displayAppealExpirationInfo?: boolean
  defendantInfoActionButton?: DefendantInfoActionButton
  displayVerdictViewDate?: boolean
  defenders?: Defender[]
}

interface UniqueDefendersProps {
  defenders: Defender[]
}

export const getAppealExpirationInfo = (
  viewDate?: string | null,
  serviceRequirement?: ServiceRequirement | null,
) => {
  if (!viewDate) {
    return { message: strings.appealDateNotBegun, data: null }
  }

  if (serviceRequirement === ServiceRequirement.NOT_REQUIRED) {
    return { message: strings.serviceRequirementNotRequired, data: null }
  }

  if (serviceRequirement === ServiceRequirement.NOT_APPLICABLE) {
    return { message: strings.serviceRequirementNotApplicable, data: null }
  }

  const today = new Date()
  const expiryDate = new Date(viewDate)
  expiryDate.setDate(expiryDate.getDate() + 28)

  const message =
    today < expiryDate
      ? strings.appealExpirationDate
      : strings.appealDateExpired

  return { message, data: formatDate(expiryDate) }
}

const UniqueDefenders: FC<UniqueDefendersProps> = ({ defenders }) => {
  const { formatMessage } = useIntl()

  const uniqueDefenders = defenders?.filter(
    (defender, index, self) =>
      index === self.findIndex((d) => d.email === defender.email),
  )

  return (
    <Box display="flex" component="p">
      {uniqueDefenders.length > 1 ? (
        <Text as="div">{`${formatMessage(strings.defenders)}: `}</Text>
      ) : (
        <Text as="span" whiteSpace="pre">
          {defenders[0].sessionArrangement ===
          SessionArrangements.ALL_PRESENT_SPOKESPERSON
            ? `${formatMessage(strings.spokesperson)}: `
            : `${formatMessage(strings.defender)}: `}
        </Text>
      )}
      {uniqueDefenders.map((defender, index) =>
        defender.name ? (
          <Box display="inlineFlex" key={defender.name} component="span">
            {RenderPersonalData(
              defender.name,
              defender.email,
              defender.phoneNumber,
              false,
            )}
          </Box>
        ) : (
          <Text key={`defender_not_registered_${index}`}>
            {formatMessage(strings.noDefender)}
          </Text>
        ),
      )}
    </Box>
  )
}

export const DefendantInfo: FC<DefendantInfoProps> = (props) => {
  const {
    defendant,
    displayDefenderInfo,
    displayAppealExpirationInfo,
    defendantInfoActionButton,
    displayVerdictViewDate,
    defenders,
  } = props
  const { formatMessage } = useIntl()

  const appealExpirationInfo = getAppealExpirationInfo(
    defendant.verdictViewDate,
    defendant.serviceRequirement,
  )

  return (
    <div
      key={defendant.id}
      className={
        defendantInfoActionButton
          ? styles.gridRow.withButton
          : styles.gridRow.withoutButton
      }
    >
      <div className={styles.infoCardDefendant}>
        <span>
          <Text as="span" fontWeight="semiBold">
            {defendant.name}
            {defendant.nationalId &&
              `, ${formatDOB(defendant.nationalId, defendant.noNationalId)}`}
          </Text>
          <Text as="span" fontWeight="light">
            {defendant.citizenship && `, (${defendant.citizenship})`}
            {defendant.address && `, ${defendant.address}`}
          </Text>
        </span>
        {displayAppealExpirationInfo && (
          <Box>
            <Text as="span">
              {formatMessage(appealExpirationInfo.message, {
                appealExpirationDate: appealExpirationInfo.data,
              })}
            </Text>
          </Box>
        )}
        {displayDefenderInfo &&
          (defendant.defenderName ? (
            RenderPersonalData(
              defendant.defenderName,
              defendant.defenderEmail,
              defendant.defenderPhoneNumber,
              false,
            )
          ) : (
            <Text>{`${formatMessage(strings.defender)}: ${formatMessage(
              strings.noDefender,
            )}`}</Text>
          ))}
        {defenders && <UniqueDefenders defenders={defenders} />}
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
