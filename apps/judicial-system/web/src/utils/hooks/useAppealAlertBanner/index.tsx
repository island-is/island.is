import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { TempCase } from '@island.is/judicial-system-web/src/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import { Button, LinkContext, LinkV2, Text } from '@island.is/island-ui/core'
import {
  APPEAL_ROUTE,
  DEFENDER_APPEAL_ROUTE,
  DEFENDER_STATEMENT_ROUTE,
  STATEMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCourtRole,
  isProsecutionRole,
} from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  UserRole,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './strings'

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

const useAppealAlertBanner = (
  workingCase: TempCase,
  onAppealAfterDeadline?: () => void,
  onReceiveAppeal?: () => void,
) => {
  const { formatMessage } = useIntl()
  const { user, limitedAccess } = useContext(UserContext)
  const isCourtRoleUser = isCourtRole(user?.role)
  const isProsecutionRoleUser = isProsecutionRole(user?.role)
  const isDefenderRoleUser = limitedAccess
  let title = ''
  let description: string | undefined = undefined
  let child: React.ReactElement | null = null

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
  } = workingCase

  const hasCurrentUserSentStatement =
    (isProsecutionRoleUser && prosecutorStatementDate) ||
    (isDefenderRoleUser && defendantStatementDate)

  // HIGH COURT BANNER INFO IS HANDLED HERE
  if (user?.institution?.type === InstitutionType.HIGH_COURT) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDeadlineDescription, {
      isStatementDeadlineExpired:
        workingCase.isStatementDeadlineExpired || false,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })
  }
  // DEFENDER, PROSECUTOR AND COURT BANNER INFO IS HANDLED HERE:
  // When appeal has been received
  else if (appealState === CaseAppealState.RECEIVED) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDeadlineDescription, {
      isStatementDeadlineExpired:
        workingCase.isStatementDeadlineExpired || false,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })
    // if the current user has already sent a statement, we don't want to display
    // the link to send a statement, instead we want to display the date it was sent
    if (hasCurrentUserSentStatement) {
      child = (
        <Text variant="h4" color="mint800">
          {formatMessage(strings.statementSentDescription, {
            statementSentDate: isProsecutionRoleUser
              ? formatDate(prosecutorStatementDate, 'PPPp')
              : formatDate(defendantStatementDate, 'PPPp'),
          })}
        </Text>
      )
    } else if (isCourtRoleUser) {
      child = (
        <Text variant="h4" color="mint800">
          {formatMessage(strings.appealReceivedNotificationSent, {
            appealReceivedDate: formatDate(appealReceivedByCourtDate, 'PPPp'),
          })}
        </Text>
      )
    } else {
      child = renderLink(
        formatMessage(strings.statementLinkText),
        isDefenderRoleUser
          ? `${DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`
          : `${STATEMENT_ROUTE}/${workingCase.id}`,
      )
    }
  }
  // When case has been appealed by prosecuor or defender
  else if (hasBeenAppealed) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDescription, {
      actor:
        appealedByRole === UserRole.PROSECUTOR
          ? formatMessage(core.prosecutor)
          : formatMessage(core.defender),
      appealDate: formatDate(appealedDate, 'PPPp'),
    })
    if (isProsecutionRoleUser || isDefenderRoleUser) {
      child = hasCurrentUserSentStatement
        ? (child = (
            <Text variant="h4" color="mint800">
              {formatMessage(strings.statementSentDescription, {
                statementSentDate: isProsecutionRoleUser
                  ? formatDate(prosecutorStatementDate, 'PPPp')
                  : formatDate(defendantStatementDate, 'PPPp'),
              })}
            </Text>
          ))
        : renderLink(
            formatMessage(strings.statementLinkText),
            `${
              isDefenderRoleUser ? DEFENDER_STATEMENT_ROUTE : STATEMENT_ROUTE
            }/${workingCase.id}`,
          )
    } else if (isCourtRoleUser) {
      child = (
        <Button variant="text" size="small" onClick={onReceiveAppeal}>
          {formatMessage(strings.appealReceivedNotificationLinkText)}
        </Button>
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
      renderLink(
        formatMessage(strings.appealLinkText),
        `${isDefenderRoleUser ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE}/${
          workingCase.id
        }`,
      )
    )
  }

  return {
    title,
    description,
    child,
  }
}

export default useAppealAlertBanner
