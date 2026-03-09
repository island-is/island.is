import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, LinkV2, Tag, Text } from '@island.is/island-ui/core'
import { INDICTMENTS_COURT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  districtCourtAbbreviation,
  formatDate,
  formatDOB,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  Defendant,
  ServiceRequirement,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
import { useConnectedCasesQuery } from './connectedCases.generated'
import {
  getAppealExpirationInfo,
  getVerdictViewDateText,
} from './DefendantInfo.logic'
import { strings as infoCardStrings } from '../useInfoCardItems.strings'
import { strings } from './DefendantInfo.strings'
import { link } from '../../MarkdownWrapper/MarkdownWrapper.css'
import * as styles from './DefendantInfo.css'

interface Defender {
  name?: string | null
  defenderNationalId?: string | null
  sessionArrangement?: SessionArrangements | null
  email?: string | null
  phoneNumber?: string | null
}

interface DefendantInfoProps {
  defendant: Defendant
  workingCaseId: string
  courtId?: string
  displayAppealExpirationInfo?: boolean
  displayVerdictViewDate?: boolean
  displaySentToPrisonAdminDate?: boolean
  defender?: Defender
  displayOpenCaseReference?: boolean
  isDismissalCase?: boolean
  isCancellationCase?: boolean
  isFineCase?: boolean
}

const ConnectedCasesInfo = ({
  defendant,
  workingCaseId,
  courtId,
}: {
  defendant: Defendant
  workingCaseId: string
  courtId?: string
}) => {
  const { data: connectedCasesData } = useConnectedCasesQuery({
    variables: { input: { id: workingCaseId } },
  })

  const connectedCases = connectedCasesData?.connectedCases
    ?.filter((connectedCase) =>
      connectedCase.defendants?.some((d) =>
        defendant.noNationalId
          ? defendant.nationalId === d.nationalId && defendant.name === d.name
          : d.nationalId &&
            normalizeAndFormatNationalId(defendant.nationalId).includes(
              d.nationalId,
            ),
      ),
    )
    .map((connectedCase) => {
      const hasCourtAccess = courtId === connectedCase.court?.id
      const key = `${defendant.id}-${courtId}-${connectedCase.courtCaseNumber}`

      return hasCourtAccess ? (
        <LinkV2
          href={`${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${connectedCase.id}`}
          className={link}
          key={key}
        >
          <Text as="span" whiteSpace="pre">
            {connectedCase.courtCaseNumber}
          </Text>
        </LinkV2>
      ) : (
        <Text as="span" whiteSpace="pre" key={key}>
          {`${connectedCase.courtCaseNumber} (${districtCourtAbbreviation(
            connectedCase.court?.name,
          )})`}
        </Text>
      )
    })

  return (
    connectedCases &&
    connectedCases.length > 0 && (
      <Box display="flex" flexWrap="wrap">
        <Box
          display="inlineFlex"
          columnGap={1}
          alignItems="center"
          className={styles.connectedCasesContainer}
        >
          <Icon icon="warning" size="medium" color="blue400" type="outline" />
          <Text fontWeight="semiBold">{'Opin mál gegn ákærða: '}</Text>
        </Box>
        {connectedCases.map((connectedCase, i) => (
          <Box component="span" key={i}>
            {connectedCase}
            {i < connectedCases.length - 1 && (
              <Text as="span" whiteSpace="pre">{`, `}</Text>
            )}
          </Box>
        ))}
      </Box>
    )
  )
}

export const DefendantInfo: FC<DefendantInfoProps> = (props) => {
  const {
    defendant,
    workingCaseId,
    courtId,
    displayAppealExpirationInfo,
    displayVerdictViewDate,
    displaySentToPrisonAdminDate = true,
    displayOpenCaseReference,
    defender,
    isDismissalCase,
    isCancellationCase,
    isFineCase,
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
    <Box display="flex" justifyContent="spaceBetween">
      <div className={grid({ gap: 1 })}>
        <Text>
          <Text as="span" fontWeight="semiBold">{`${formatMessage(
            infoCardStrings.name,
          )}: `}</Text>
          <Text as="span">
            {defendant.name}
            {defendant.nationalId &&
              `, ${formatDOB(defendant.nationalId, defendant.noNationalId)}`}
            {defendant.citizenship && `, (${defendant.citizenship})`}
          </Text>
        </Text>
        <Text>
          <Text as="span" fontWeight="semiBold">{`${formatMessage(
            core.addressOrResidence,
          )}: `}</Text>
          <Text as="span">
            {defendant.address ? defendant.address : 'Ekki skráð'}
          </Text>
        </Text>
        <Text>
          <Text as="span" whiteSpace="pre" fontWeight="semiBold">
            {`${defenderLabel}: `}
          </Text>
          {hasDefender ? (
            RenderPersonalData({
              name: defenderName,
              email: defenderEmail,
              phoneNumber: defenderPhoneNumber,
              breakSpaces: false,
            })
          ) : (
            <Text as="span">{formatMessage(strings.noDefender)}</Text>
          )}
        </Text>
        {displayAppealExpirationInfo && (
          <Text fontWeight="semiBold">
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
            <Text fontWeight="semiBold">
              {getVerdictViewDateText(
                formatMessage,
                defendant.verdict?.serviceDate,
              )}
            </Text>
          )}
        {displaySentToPrisonAdminDate && defendant.sentToPrisonAdminDate && (
          <Text fontWeight="semiBold">
            {formatMessage(strings.sendToPrisonAdminDate, {
              date: formatDate(defendant.sentToPrisonAdminDate, 'PPP'),
            })}
          </Text>
        )}
        {displayOpenCaseReference && (
          <ConnectedCasesInfo
            defendant={defendant}
            workingCaseId={workingCaseId}
            courtId={courtId}
          />
        )}
      </div>
      {defendant.verdict ? (
        <Tag
          variant={
            defendant.verdict.isDefaultJudgement ? 'purple' : 'darkerBlue'
          }
          outlined
          disabled
        >
          {defendant.verdict.isDefaultJudgement ? 'Útivistardómur' : 'Dómur'}
        </Tag>
      ) : isDismissalCase ? (
        <Tag variant="blue" outlined disabled>
          Frávísun
        </Tag>
      ) : isCancellationCase ? (
        <Tag variant="rose" outlined disabled>
          Niðurfelling
        </Tag>
      ) : isFineCase ? (
        <Tag variant="mint" outlined disabled>
          Viðurlagaákvörðun
        </Tag>
      ) : null}
    </Box>
  )
}
