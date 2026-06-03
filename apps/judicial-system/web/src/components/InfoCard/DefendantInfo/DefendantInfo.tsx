import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'

import { Box, Icon, LinkV2, Tag, Text } from '@island.is/island-ui/core'
import { DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  districtCourtAbbreviation,
  formatDate,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import {
  CaseIndictmentRulingDecision,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  Defendant,
  ServiceRequirement,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { UserContext } from '../../UserProvider/UserProvider'
import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
import {
  getAppealExpirationInfo,
  getDefendantTagConfig,
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
  courtId,
}: {
  defendant: Defendant
  courtId?: string
}) => {
  const connectedCases = defendant.connectedCases?.map((connectedCase) => {
      const hasCourtAccess = courtId === connectedCase.court?.id
      const key = `${defendant.id}-${courtId}-${connectedCase.courtCaseNumber}`

      return hasCourtAccess ? (
        <LinkV2
          href={`${DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE}/${connectedCase.id}`}
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
    isNonEmptyArray(connectedCases) && (
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
  const { user } = useContext(UserContext)
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

  const defendantTagConfig = getDefendantTagConfig({
    verdict: defendant.verdict,
    isPublicProsecutionOffice: isPublicProsecutionOfficeUser(user),
    isDismissalCase,
    isCancellationCase,
    isFineCase,
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
        {defendant.indictmentCancelledOrDismissedState && (
          <Text fontWeight="semiBold">{`${
            defendant.indictmentCancelledOrDismissedState.type ===
            CaseIndictmentRulingDecision.DISMISSAL
              ? 'Vísað frá'
              : 'Niðurfellt'
          } ${formatDate(
            defendant.indictmentCancelledOrDismissedState.time,
            'P',
          )}`}</Text>
        )}
        {displayOpenCaseReference && (
          <ConnectedCasesInfo
            defendant={defendant}
            courtId={courtId}
          />
        )}
      </div>
      {defendantTagConfig && defendant.verdict ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            key={defendantTagConfig.key}
          >
            <Tag variant={defendantTagConfig.variant} outlined disabled>
              {defendantTagConfig.label}
            </Tag>
          </motion.span>
        </AnimatePresence>
      ) : defendantTagConfig ? (
        <Tag variant={defendantTagConfig.variant} outlined disabled>
          {defendantTagConfig.label}
        </Tag>
      ) : null}
    </Box>
  )
}
