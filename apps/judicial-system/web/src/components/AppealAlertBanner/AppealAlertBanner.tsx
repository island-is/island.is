import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertBanner } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseAppealState,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase } from '@island.is/judicial-system-web/src/types'
import { getAppealEndDate } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  APPEAL_ROUTE,
  DEFENDER_APPEAL_ROUTE,
  STATEMENT_ROUTE,
  DEFENDER_STATEMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  isCourtRole,
  isProsecutionRole,
} from '@island.is/judicial-system/types'

import { strings } from './AppealAlertBanner.strings'
import { UserContext } from '../UserProvider/UserProvider'

interface Props {
  workingCase: TempCase
}

interface AppealInfo {
  canBeAppealed: boolean
  hasBeenAppealed: boolean
  appealDeadline?: string
  statementDeadline?: string
  isStatementDeadlineExpired?: boolean
  appealedByRole?: UserRole
  appealedDate?: string
  hasProsecutionStatement?: boolean
  hasDefenderStatement?: boolean
  prosecutionStatementDate?: string
  defenderStatementDate?: string
}

export const getAppealInfo = (workingCase: TempCase): AppealInfo => {
  const {
    courtEndTime,
    appealState,
    isAppealDeadlineExpired,
    accusedAppealDecision,
    prosecutorAppealDecision,
    prosecutorPostponedAppealDate,
    accusedPostponedAppealDate,
  } = workingCase

  const canBeAppealed = Boolean(
    courtEndTime &&
      !appealState &&
      !isAppealDeadlineExpired &&
      (accusedAppealDecision === CaseAppealDecision.POSTPONE ||
        prosecutorAppealDecision === CaseAppealDecision.POSTPONE),
  )

  // I know this is a very basic thing to wrap in its own variable but I
  // did it because there are currently 2 ways in which a case
  // can be recognized as appealed, so this will become more complex
  // when we begin listening to whether a case was appealed in court.
  // Currently we only check whether it was appealed after court
  const hasBeenAppealed = Boolean(
    appealState && appealState === CaseAppealState.Appealed,
  )

  const appealedByRole = prosecutorPostponedAppealDate
    ? UserRole.Prosecutor
    : accusedPostponedAppealDate
    ? UserRole.Defender
    : undefined

  const appealedDate =
    appealedByRole === UserRole.Prosecutor
      ? prosecutorPostponedAppealDate ?? undefined
      : accusedPostponedAppealDate ?? undefined

  const appealDeadline = courtEndTime
    ? getAppealEndDate(courtEndTime ?? '')
    : undefined

  //TODO: Put correct info in these variables when we have them
  //implemented
  const statementDeadline = new Date().toISOString()
  const isStatementDeadlineExpired = false
  const hasProsecutionStatement = false
  const prosecutionStatementDate = undefined
  const hasDefenderStatement = true
  const defenderStatementDate = new Date().toISOString()

  return {
    hasBeenAppealed,
    canBeAppealed,
    appealedByRole,
    appealedDate,
    appealDeadline,
    statementDeadline,
    isStatementDeadlineExpired,
    prosecutionStatementDate,
    hasProsecutionStatement,
    hasDefenderStatement,
    defenderStatementDate,
  } as AppealInfo
}

const AppealAlertBanner: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { workingCase } = props
  const {
    appealedByRole,
    appealedDate,
    canBeAppealed,
    hasBeenAppealed,
    appealDeadline,
    statementDeadline,
    hasProsecutionStatement,
    hasDefenderStatement,
    prosecutionStatementDate,
    defenderStatementDate,
  } = getAppealInfo(workingCase)

  let alertTitle, alertLinkTitle, alertLinkHref, alertDescription

  const isCourtRoleUser = isCourtRole(user?.role)
  const isProsecutionRoleUser = isProsecutionRole(user?.role)
  const isDefenderRoleUser = user?.role === UserRole.Defender

  // Deal with banners after case has been marked as Received by the judge
  if (workingCase.appealState === CaseAppealState.Received) {
    alertTitle = formatMessage(strings.statementTitle)
    alertDescription = formatMessage(strings.statementDeadlineDescription, {
      isStatementDeadlineExpired: workingCase.isAppealDeadlineExpired || false,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })
    if (
      (isProsecutionRoleUser && hasProsecutionStatement) ||
      (isDefenderRoleUser && hasDefenderStatement)
    ) {
      //TODO: Make this text separate and green like in the design
      //Needs to be implemented in island-ui component
      alertDescription += ` ${formatMessage(strings.statementSentDescription, {
        statementSentDate: isProsecutionRoleUser
          ? formatDate(prosecutionStatementDate, 'PPPp')
          : formatDate(defenderStatementDate, 'PPPp'),
      })}`
    } else if (isCourtRoleUser) {
      alertDescription += ` ${formatMessage(
        strings.appealReceivedNotificationLinkText,
        { statementSentDate: new Date() },
      )}`
    } else {
      alertLinkTitle = formatMessage(strings.statementLinkText)
      alertLinkHref = isDefenderRoleUser
        ? `${DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`
        : `${STATEMENT_ROUTE}/${workingCase.id}`
    }
    // Handle banners when case has been appealed by either defendant or prosecutor
    // but the judge has not yet marked it as received
  } else if (hasBeenAppealed) {
    alertTitle = formatMessage(strings.statementTitle)
    alertDescription = formatMessage(strings.statementDescription, {
      actor:
        appealedByRole === UserRole.Prosecutor
          ? formatMessage(core.prosecutor)
          : formatMessage(core.defender),
      appealDate: formatDate(appealedDate, 'PPPp'),
    })
    if (isProsecutionRoleUser || isDefenderRoleUser) {
      alertLinkTitle = formatMessage(strings.statementLinkText)
      alertLinkHref = isDefenderRoleUser
        ? `${DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`
        : `${STATEMENT_ROUTE}/${workingCase.id}`
    } else if (isCourtRoleUser) {
      alertLinkTitle = formatMessage(strings.appealReceivedNotificationLinkText)
      alertLinkHref = '/krofur' // TODO: Implement notification link
    }
  } // Handle banners when case has been postponed but no official appeal has been made
  else if (canBeAppealed) {
    alertTitle = formatMessage(strings.appealDeadlineTitle, {
      isAppealDeadlineExpired: workingCase.isAppealDeadlineExpired || false,
      appealDeadline,
    })
    // We only want to display the appeal link to prosecution roles and the defender
    // not the judge
    if (isProsecutionRoleUser || isDefenderRoleUser) {
      alertLinkTitle = formatMessage(strings.appealLinkText)
      alertLinkHref = isDefenderRoleUser
        ? `${DEFENDER_APPEAL_ROUTE}/${workingCase.id}`
        : `${APPEAL_ROUTE}/${workingCase.id}`
    }
  } else return null

  return (
    <AlertBanner
      title={alertTitle}
      description={alertDescription}
      variant="warning"
      link={
        alertLinkHref && alertLinkTitle
          ? {
              href: alertLinkHref,
              title: alertLinkTitle,
            }
          : undefined
      }
    />
  )
}

export default AppealAlertBanner
