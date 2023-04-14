import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseAppealState,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase } from '@island.is/judicial-system-web/src/types'
import {
  APPEAL_ROUTE,
  DEFENDER_APPEAL_ROUTE,
  STATEMENT_ROUTE,
  DEFENDER_STATEMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCourtRole,
  isProsecutionRole,
} from '@island.is/judicial-system/types'
import { LinkContext, LinkV2, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'

import { strings } from './AppealAlertBanner.strings'
import { UserContext } from '../UserProvider/UserProvider'
import { AlertBanner } from '../AlertBanner'

interface Props {
  workingCase: TempCase
}

const renderLink = (text: string, href: string) => {
  return (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <LinkV2
            href={href}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {children}
          </LinkV2>
        ),
      }}
    >
      <Text>
        <a href={href}>{text}</a>
      </Text>
    </LinkContext.Provider>
  )
}

const AppealAlertBanner: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { limitedAccess, user } = useContext(UserContext)
  const appealDeadlineHash = '#kaerufrestur_utrunninn'

  const { workingCase } = props

  const {
    prosecutorStatementDate,
    defenderStatementDate,
    statementDeadline,
    hasBeenAppealed,
    appealedByRole,
    appealedDate,
    canBeAppealed,
    appealDeadline,
  } = workingCase

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
      (isProsecutionRoleUser && prosecutorStatementDate) ||
      (isDefenderRoleUser && defenderStatementDate)
    ) {
      //TODO: Make this text separate and green like in the design
      //Needs to be implemented in island-ui component
      alertDescription += ` ${formatMessage(strings.statementSentDescription, {
        statementSentDate: isProsecutionRoleUser
          ? formatDate(prosecutorStatementDate, 'PPPp')
          : formatDate(defenderStatementDate, 'PPPp'),
      })}`
    } else if (isCourtRoleUser) {
      alertDescription += ` ${formatMessage(
        strings.appealReceivedNotificationSent,
        { appealReceivedDate: formatDate(new Date(), 'PPPp') },
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
    alertLinkTitle = formatMessage(strings.statementLinkText)
    alertLinkHref = workingCase.isAppealDeadlineExpired
      ? renderLink(
          alertLinkTitle,
          `${
            isDefenderRoleUser
              ? constants.DEFENDER_ROUTE
              : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
          }/${workingCase.id}${appealDeadlineHash}`,
        )
      : renderLink(
          alertLinkTitle,
          `${
            isDefenderRoleUser
              ? constants.DEFENDER_APPEAL_ROUTE
              : constants.APPEAL_ROUTE
          }/${workingCase.id}`,
        )
  } else if (canBeAppealed) {
    alertTitle = formatMessage(strings.appealDeadlineTitle, {
      appealDeadline,
      isAppealDeadlineExpired: workingCase.isAppealDeadlineExpired,
    })
    // We only want to display the appeal link to prosecution roles and the defender
    // not the judge
    if (isProsecutionRoleUser || isDefenderRoleUser) {
      alertLinkTitle = formatMessage(strings.appealLinkText)
      alertLinkHref = renderLink(
        alertLinkTitle,
        isDefenderRoleUser
          ? `${DEFENDER_APPEAL_ROUTE}/${workingCase.id}`
          : `${APPEAL_ROUTE}/${workingCase.id}`,
      )
    }
  } else {
    return null
  }

  return (
    <AlertBanner
      title={alertTitle}
      description={alertDescription}
      variant="warning"
    >
      {alertLinkHref}
    </AlertBanner>
  )
}

export default AppealAlertBanner
