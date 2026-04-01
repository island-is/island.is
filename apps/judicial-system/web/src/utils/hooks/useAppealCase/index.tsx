import { ReactElement, useContext, useState } from 'react'
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
  isDefenceUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'
import {
  AlertBanner,
  FormContext,
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseTransition,
  InstitutionType,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { hasSentNotification } from '../../utils'
import useCase from '../useCase'
import { strings } from './useAppealCase.strings'
import * as styles from './useAppealCase.css'

const renderLinkButton = (text: string, href: string) => {
  return (
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
}

export const getAppealDecision = (
  formatMessage: IntlShape['formatMessage'],
  appealRulingDecision?: CaseAppealRulingDecision | null,
) => {
  switch (appealRulingDecision) {
    case CaseAppealRulingDecision.ACCEPTING:
      return formatMessage(appealRuling.decisionAccept)
    case CaseAppealRulingDecision.REPEAL:
      return formatMessage(appealRuling.decisionRepeal)
    case CaseAppealRulingDecision.CHANGED:
    case CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY:
      return formatMessage(appealRuling.decisionChanged)
    case CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL:
      return formatMessage(appealRuling.decisionDismissedFromCourtOfAppeal)
    case CaseAppealRulingDecision.DISMISSED_FROM_COURT:
      return formatMessage(appealRuling.decisionDismissedFromCourt)
    case CaseAppealRulingDecision.REMAND:
      return formatMessage(appealRuling.decisionRemand)
    case CaseAppealRulingDecision.DISCONTINUED:
      return formatMessage(appealRuling.decisionDiscontinued)
    default:
      return undefined
  }
}

const useAppealCase = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, setWorkingCase } =
    useContext(FormContext)
  const { transitionCase } = useCase()

  const [appealModalVisible, setAppealModalVisible] = useState<
    | 'ConfirmAppealAfterDeadline'
    | 'ConfirmStatementAfterDeadline'
    | 'AppealReceived'
    | undefined
  >()

  const handleReceivedTransition = () => {
    transitionCase(
      workingCase.id,
      CaseTransition.RECEIVE_APPEAL,
      setWorkingCase,
    ).then((updatedCase) => {
      if (updatedCase) {
        setAppealModalVisible('AppealReceived')
      }
    })
  }

  const appealRoute = isDefenceUser(user) ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE
  const statementRoute = isDefenceUser(user)
    ? DEFENDER_STATEMENT_ROUTE
    : STATEMENT_ROUTE

  let title = ''
  let description: string | undefined = undefined
  let child: ReactElement | null = null

  const {
    appealCase,
    statementDeadline,
    hasBeenAppealed,
    appealedByRole,
    appealedDate,
    canBeAppealed,
    appealDeadline,
    isAppealDeadlineExpired,
    isStatementDeadlineExpired,
    sharedWithProsecutorsOffice,
  } = workingCase
  const {
    appealState,
    prosecutorStatementDate,
    defendantStatementDate,
    appealReceivedByCourtDate,
    appealRulingDecision,
  } = appealCase ?? {}

  const isSharedWithProsecutor =
    isProsecutionUser(user) &&
    user?.institution?.id === sharedWithProsecutorsOffice?.id

  const hasCurrentUserSentStatement =
    (isProsecutionUser(user) && prosecutorStatementDate) ||
    (isDefenceUser(user) && defendantStatementDate)

  const appealCompletedDate = hasSentNotification(
    NotificationType.APPEAL_COMPLETED,
    workingCase.notifications,
  ).date

  // WITHDRAWN APPEAL BANNER IS HANDLED HERE:
  if (appealState === CaseAppealState.WITHDRAWN) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.appealWithdrawnDescription, {
      appealWithdrawnDate: formatDate(appealReceivedByCourtDate, 'PPPp'),
    })
  }

  // COURT OF APPEALS AND SHARED WITH PROSECUTOR BANNER INFO IS HANDLED HERE
  else if (
    user?.institution?.type === InstitutionType.COURT_OF_APPEALS ||
    isSharedWithProsecutor
  ) {
    if (appealState === CaseAppealState.COMPLETED) {
      title = formatMessage(strings.appealCompletedTitle, {
        appealedDate: formatDate(appealCompletedDate, 'PPP'),
      })
      description = getAppealDecision(formatMessage, appealRulingDecision)
    } else {
      title = formatMessage(strings.statementTitle)
      description = formatMessage(strings.statementDeadlineDescription, {
        isStatementDeadlineExpired: isStatementDeadlineExpired || false,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
      })
    }
  }

  // DEFENDER, PROSECUTOR AND DISTRICT COURT BANNER INFO IS HANDLED HERE:
  // When appeal has been received
  else if (appealState === CaseAppealState.RECEIVED) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDeadlineDescription, {
      isStatementDeadlineExpired: isStatementDeadlineExpired || false,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })
    // if the current user has already sent a statement, we don't want to display
    // the link to send a statement, instead we want to display the date it was sent
    if (hasCurrentUserSentStatement) {
      child = (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {formatMessage(strings.statementSentDescription, {
            statementSentDate: isProsecutionUser(user)
              ? formatDate(prosecutorStatementDate, 'PPPp')
              : formatDate(defendantStatementDate, 'PPPp'),
          })}
        </Text>
      )
    } else if (isDistrictCourtUser(user)) {
      child = (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {formatMessage(strings.appealReceivedNotificationSent, {
            appealReceivedDate: formatDate(appealReceivedByCourtDate, 'PPPp'),
          })}
        </Text>
      )
    } else {
      child = isStatementDeadlineExpired ? (
        <Button
          variant="text"
          size="small"
          onClick={() => setAppealModalVisible('ConfirmStatementAfterDeadline')}
        >
          {formatMessage(strings.statementLinkText)}
        </Button>
      ) : (
        renderLinkButton(
          formatMessage(strings.statementLinkText),
          isDefenceUser(user)
            ? `${DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`
            : `${STATEMENT_ROUTE}/${workingCase.id}`,
        )
      )
    }
  } else if (appealState === CaseAppealState.COMPLETED) {
    title = formatMessage(strings.appealCompletedTitle, {
      appealedDate: formatDate(appealCompletedDate, 'PPP'),
    })
    description = getAppealDecision(formatMessage, appealRulingDecision)
  }
  // When case has been appealed by prosecuor or defender
  else if (hasBeenAppealed) {
    title = formatMessage(strings.statementTitle)
    description =
      workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL ||
      workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
        ? formatMessage(strings.appealedInCourtStatementDescription, {
            appealedByProsecutor: appealedByRole === UserRole.PROSECUTOR,
          })
        : formatMessage(strings.statementDescription, {
            appealedByProsecutor: appealedByRole === UserRole.PROSECUTOR,
            appealDate: formatDate(appealedDate, 'PPPp'),
          })
    if (isProsecutionUser(user) || isDefenceUser(user)) {
      child = hasCurrentUserSentStatement
        ? (child = (
            <Text variant="small" color="mint800" fontWeight="semiBold">
              {formatMessage(strings.statementSentDescription, {
                statementSentDate: isProsecutionUser(user)
                  ? formatDate(prosecutorStatementDate, 'PPPp')
                  : formatDate(defendantStatementDate, 'PPPp'),
              })}
            </Text>
          ))
        : renderLinkButton(
            formatMessage(strings.statementLinkText),
            `${
              isDefenceUser(user) ? DEFENDER_STATEMENT_ROUTE : STATEMENT_ROUTE
            }/${workingCase.id}`,
          )
    } else if (isDistrictCourtUser(user)) {
      child = (
        <Box>
          <Button
            variant="text"
            size="small"
            onClick={handleReceivedTransition}
          >
            {`${formatMessage(strings.appealReceivedNotificationLinkText)} `}
          </Button>
          <span className={styles.tooltipContainer}>
            <Tooltip text={formatMessage(strings.notifyCOATooltip)} />
          </span>
        </Box>
      )
    }
  }
  // When case can be appealed
  else if (canBeAppealed) {
    title = formatMessage(strings.appealDeadlineTitle, {
      appealDeadline: formatDate(appealDeadline, 'PPPp'),
      isAppealDeadlineExpired: isAppealDeadlineExpired,
    })
    child = isAppealDeadlineExpired ? (
      <Button
        variant="text"
        size="small"
        onClick={() => setAppealModalVisible('ConfirmAppealAfterDeadline')}
      >
        {formatMessage(strings.appealLinkText)}
      </Button>
    ) : (
      renderLinkButton(
        formatMessage(strings.appealLinkText),
        `${isDefenceUser(user) ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE}/${
          workingCase.id
        }`,
      )
    )
  }

  const appealModals = (
    <>
      {appealModalVisible === 'ConfirmAppealAfterDeadline' && (
        <Modal
          title="Kærufrestur er liðinn"
          text="Viltu halda áfram og senda kæru?"
          primaryButton={{
            text: 'Já, senda kæru',
            onClick: () => router.push(`${appealRoute}/${workingCase.id}`),
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => setAppealModalVisible(undefined),
          }}
        />
      )}
      {appealModalVisible === 'ConfirmStatementAfterDeadline' && (
        <Modal
          title="Frestur til að skila greinargerð er liðinn"
          text="Viltu halda áfram og senda greinargerð?"
          primaryButton={{
            text: 'Já, senda greinargerð',
            onClick: () => router.push(`${statementRoute}/${workingCase.id}`),
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => setAppealModalVisible(undefined),
          }}
        />
      )}
      {appealModalVisible === 'AppealReceived' && (
        <Modal
          title="Tilkynningar sendar á málsaðila"
          text="Kæra hefur borist Landsrétti. Sækjandi og verjandi hafa fengið tilkynningu um frest til að skila greinargerð."
          primaryButton={{
            text: 'Loka glugga',
            onClick: () => setAppealModalVisible(undefined),
          }}
        />
      )}
    </>
  )

  const appealBanner =
    isLoadingWorkingCase || (!title && !description) ? null : (
      <AlertBanner variant="warning" title={title} description={description}>
        {child}
      </AlertBanner>
    )

  return {
    appealBanner,
    appealModals,
  }
}

export default useAppealCase
