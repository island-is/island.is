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
  isDefenceUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  InstitutionType,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { hasSentNotification } from '../../utils'
import { strings } from './useAppealAlertBanner.strings'
import * as styles from './useAppealAlertBanner.css'

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

const useAppealAlertBanner = (
  workingCase: Case,
  onAppealAfterDeadline?: () => void,
  onStatementAfterDeadline?: () => void,
  onReceiveAppeal?: () => void,
) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { isLoadingWorkingCase } = useContext(FormContext)

  let title = ''
  let description: string | undefined = undefined
  let child: ReactElement | null = null

  const {
    prosecutorStatementDate,
    defendantStatementDate,
    statementDeadline,
    hasBeenAppealed,
    appealedByRole,
    appealedDate,
    canBeAppealed,
    appealDeadline,
    appealState,
    isAppealDeadlineExpired,
    appealReceivedByCourtDate,
    isStatementDeadlineExpired,
    appealRulingDecision,
    sharedWithProsecutorsOffice,
  } = workingCase

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
        <Button variant="text" size="small" onClick={onStatementAfterDeadline}>
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
          <Button variant="text" size="small" onClick={onReceiveAppeal}>
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
      <Button variant="text" size="small" onClick={onAppealAfterDeadline}>
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

  return {
    isLoadingAppealBanner: isLoadingWorkingCase,
    title,
    description,
    child,
  }
}

export default useAppealAlertBanner
