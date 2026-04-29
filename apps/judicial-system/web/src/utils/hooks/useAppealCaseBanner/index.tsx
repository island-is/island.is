import { ReactElement, useContext } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Button, Text, Tooltip } from '@island.is/island-ui/core'
import {
  APPEAL_ROUTE,
  DEFENDER_APPEAL_ROUTE,
  DEFENDER_STATEMENT_ROUTE,
  STATEMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  Feature,
  isDefenceUser,
  isDistrictCourtUser,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { appealRuling } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  FeatureContext,
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseTransition,
  InstitutionType,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getAppealActorText,
  getDefenceUserPartyIds,
  hasSentNotification,
} from '../../utils'
import useAppealCase from '../useAppealCase'
import useAppealCaseModals from '../useAppealCaseModals'
import * as styles from './useAppealCaseBanner.css'

const renderLinkButton = (text: string, href: string) => (
  <Button
    variant="text"
    size="small"
    onClick={() => {
      router.push(href)
    }}
  >
    {text}
  </Button>
)

export const getAppealDecision = (
  formatMessage: IntlShape['formatMessage'],
  appealRulingDecision?: AppealCaseRulingDecision | null,
) => {
  switch (appealRulingDecision) {
    case AppealCaseRulingDecision.ACCEPTING:
      return formatMessage(appealRuling.decisionAccept)
    case AppealCaseRulingDecision.REPEAL:
      return formatMessage(appealRuling.decisionRepeal)
    case AppealCaseRulingDecision.CHANGED:
    case AppealCaseRulingDecision.CHANGED_SIGNIFICANTLY:
      return formatMessage(appealRuling.decisionChanged)
    case AppealCaseRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL:
      return formatMessage(appealRuling.decisionDismissedFromCourtOfAppeal)
    case AppealCaseRulingDecision.DISMISSED_FROM_COURT:
      return formatMessage(appealRuling.decisionDismissedFromCourt)
    case AppealCaseRulingDecision.REMAND:
      return formatMessage(appealRuling.decisionRemand)
    case AppealCaseRulingDecision.DISCONTINUED:
      return formatMessage(appealRuling.decisionDiscontinued)
    default:
      return undefined
  }
}

const useAppealCaseBanner = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, setWorkingCase, refreshCase } =
    useContext(FormContext)
  const { transitionAppealCase, isTransitioningAppealCase } = useAppealCase()

  const appealRoute = isDefenceUser(user) ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE
  const statementRoute = isDefenceUser(user)
    ? DEFENDER_STATEMENT_ROUTE
    : STATEMENT_ROUTE

  const {
    appealCaseModals,
    openConfirmAppealAfterDeadline,
    openConfirmStatementAfterDeadline,
    openAppealReceived,
  } = useAppealCaseModals({
    confirmAppealRoute: `${appealRoute}/${workingCase.id}`,
    confirmStatementRoute: `${statementRoute}/${workingCase.id}`,
  })

  const handleReceivedTransition = async () => {
    const success = await transitionAppealCase(
      workingCase.id,
      workingCase.appealCase?.id ?? '',
      AppealCaseTransition.RECEIVE_APPEAL,
      setWorkingCase,
    )

    if (!success) {
      return
    }

    openAppealReceived()
    refreshCase()
  }

  let title = ''
  let description: string | undefined = undefined
  let child: ReactElement | null = null

  const {
    appealCase,
    hasBeenAppealed,
    canBeAppealed,
    appealDeadline,
    isAppealDeadlineExpired,
    sharedWithProsecutorsOffice,
  } = workingCase
  const {
    appealState,
    prosecutorStatementDate,
    defendantStatementDate,
    defendantStatementDates,
    civilClaimantStatementDates,
    appealReceivedByCourtDate,
    appealRulingDecision,
    statementDeadline,
    isStatementDeadlineExpired,
  } = appealCase ?? {}

  const isSharedWithProsecutor =
    isProsecutionUser(user) &&
    user?.institution?.id === sharedWithProsecutorsOffice?.id

  // For indictment cases each defender / civil claimant spokesperson sends
  // their own statement, so resolve the per-party date from the per-appeal
  // lists by id. Request cases have a single defender, so the aggregated
  // appealCase.defendantStatementDate is the right answer.
  const { defendantId, civilClaimantId } = getDefenceUserPartyIds(
    workingCase,
    user,
  )
  const currentDefenceStatementDate = isIndictmentCase(workingCase.type)
    ? defendantId
      ? defendantStatementDates?.find((d) => d.defendantId === defendantId)
          ?.statementDate
      : civilClaimantId
      ? civilClaimantStatementDates?.find(
          (c) => c.civilClaimantId === civilClaimantId,
        )?.statementDate
      : undefined
    : defendantStatementDate

  const currentUserStatementDate = isProsecutionUser(user)
    ? prosecutorStatementDate
    : isDefenceUser(user)
    ? currentDefenceStatementDate
    : undefined

  const hasCurrentUserSentStatement = Boolean(currentUserStatementDate)

  const appealCompletedDate = hasSentNotification(
    NotificationType.APPEAL_COMPLETED,
    workingCase.notifications,
  ).date

  // WITHDRAWN APPEAL BANNER IS HANDLED HERE:
  if (appealState === AppealCaseState.WITHDRAWN) {
    title = 'Úrskurður kærður'
    description = 'Afturkallað'
  }

  // COURT OF APPEALS AND SHARED WITH PROSECUTOR BANNER INFO IS HANDLED HERE
  else if (
    user?.institution?.type === InstitutionType.COURT_OF_APPEALS ||
    isSharedWithProsecutor
  ) {
    if (appealState === AppealCaseState.COMPLETED) {
      title = `Niðurstaða Landsréttar ${formatDate(appealCompletedDate, 'PPP')}`
      description = getAppealDecision(formatMessage, appealRulingDecision)
    } else {
      title = 'Úrskurður kærður'
      description = `Frestur til að skila greinargerð ${
        isStatementDeadlineExpired ? 'rann' : 'rennur'
      } út ${formatDate(statementDeadline, 'PPPp')}`
    }
  }

  // DEFENDER, PROSECUTOR AND DISTRICT COURT BANNER INFO IS HANDLED HERE:
  // When appeal has been received
  else if (appealState === AppealCaseState.RECEIVED) {
    title = 'Úrskurður kærður'
    description = `Frestur til að skila greinargerð ${
      isStatementDeadlineExpired ? 'rann' : 'rennur'
    } út ${formatDate(statementDeadline, 'PPPp')}`
    if (hasCurrentUserSentStatement) {
      child = (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {`Greinargerð send ${formatDate(currentUserStatementDate, 'PPPp')}`}
        </Text>
      )
    } else if (isDistrictCourtUser(user)) {
      child = (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {`Tilkynning um móttöku send ${formatDate(
            appealReceivedByCourtDate,
            'PPPp',
          )}`}
        </Text>
      )
    } else {
      child = isStatementDeadlineExpired ? (
        <Button
          variant="text"
          size="small"
          onClick={openConfirmStatementAfterDeadline}
        >
          Senda greinargerð
        </Button>
      ) : (
        renderLinkButton(
          'Senda greinargerð',
          isDefenceUser(user)
            ? `${DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`
            : `${STATEMENT_ROUTE}/${workingCase.id}`,
        )
      )
    }
  } else if (appealState === AppealCaseState.COMPLETED) {
    title = `Niðurstaða Landsréttar ${formatDate(appealCompletedDate, 'PPP')}`
    description = getAppealDecision(formatMessage, appealRulingDecision)
  }
  // When case has been appealed by prosecutor or defender
  else if (hasBeenAppealed) {
    title = 'Úrskurður kærður'
    description = getAppealActorText(workingCase)
    if (isProsecutionUser(user) || isDefenceUser(user)) {
      child = hasCurrentUserSentStatement ? (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {`Greinargerð send ${formatDate(currentUserStatementDate, 'PPPp')}`}
        </Text>
      ) : (
        renderLinkButton(
          'Senda greinargerð',
          `${
            isDefenceUser(user) ? DEFENDER_STATEMENT_ROUTE : STATEMENT_ROUTE
          }/${workingCase.id}`,
        )
      )
    } else if (isDistrictCourtUser(user)) {
      child = (
        <Box>
          <Button
            variant="text"
            size="small"
            onClick={handleReceivedTransition}
            loading={isTransitioningAppealCase}
          >
            {'Senda tilkynningu um kæru til Landsréttar'}
          </Button>
          <span className={styles.tooltipContainer}>
            <Tooltip text="Tilkynning um móttöku kæru og frest til að skila greinargerð sendist á Landsrétt og aðila málsins" />
          </span>
        </Box>
      )
    }
  }
  // When case can be appealed
  else if (canBeAppealed) {
    title = `Kærufrestur ${
      isAppealDeadlineExpired ? 'rann' : 'rennur'
    } út ${formatDate(appealDeadline, 'PPPp')}`
    child = isAppealDeadlineExpired ? (
      <Button
        variant="text"
        size="small"
        onClick={openConfirmAppealAfterDeadline}
      >
        Senda inn kæru
      </Button>
    ) : (
      renderLinkButton(
        'Senda inn kæru',
        `${isDefenceUser(user) ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE}/${
          workingCase.id
        }`,
      )
    )
  }

  const { features } = useContext(FeatureContext)

  const appealBanner =
    isLoadingWorkingCase ||
    (!title && !description) ||
    (isIndictmentCase(workingCase.type) &&
      !features.includes(Feature.INDICTMENT_APPEAL_RULING)) ? null : (
      <AlertBanner variant="warning" title={title} description={description}>
        {child}
      </AlertBanner>
    )

  return {
    appealBanner,
    appealModals: appealCaseModals,
  }
}

export default useAppealCaseBanner
