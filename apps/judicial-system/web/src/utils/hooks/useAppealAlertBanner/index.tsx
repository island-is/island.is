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
) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const isCourtRoleUser = isCourtRole(user?.role)
  const isProsecutionRoleUser = isProsecutionRole(user?.role)
  const isDefenderRoleUser = user?.role === UserRole.Defender
  let title = ''
  let description: string | undefined = undefined
  let child: React.ReactElement | null = null

  const {
    prosecutorStatementDate,
    defenderStatementDate,
    statementDeadline,
    hasBeenAppealed,
    appealedByRole,
    appealedDate,
    canBeAppealed,
    appealDeadline,
    appealState,
    isAppealDeadlineExpired,
  } = workingCase

  const hasCurrentUserSentStatement =
    (isProsecutionRoleUser && prosecutorStatementDate) ||
    (isDefenderRoleUser && defenderStatementDate)

  if (user?.institution?.type === InstitutionType.HighCourt) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDeadlineDescription, {
      isStatementDeadlineExpired: workingCase.isAppealDeadlineExpired || false,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })
  }
  // APPEAL HAS BEEN RECEIVED
  else if (appealState === CaseAppealState.Received) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDeadlineDescription, {
      isStatementDeadlineExpired: workingCase.isAppealDeadlineExpired || false,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })
    if (hasCurrentUserSentStatement) {
      child = (
        <Text variant="h4" color="mint800">
          {formatMessage(strings.statementSentDescription, {
            statementSentDate: isProsecutionRoleUser
              ? formatDate(prosecutorStatementDate, 'PPPp')
              : formatDate(defenderStatementDate, 'PPPp'),
          })}
        </Text>
      )
    } else if (isCourtRoleUser) {
      child = (
        <Text variant="h4" color="mint800">
          {formatMessage(strings.appealReceivedNotificationSent, {
            appealReceivedDate: formatDate(new Date(), 'PPPp'),
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
  // CASE HAS BEEN APPEALED
  else if (hasBeenAppealed) {
    title = formatMessage(strings.statementTitle)
    description = formatMessage(strings.statementDescription, {
      actor:
        appealedByRole === UserRole.Prosecutor
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
                  : formatDate(defenderStatementDate, 'PPPp'),
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
        //TODO: Call transform function when ready
        <Button variant="text" size="small" onClick={onAppealAfterDeadline}>
          {formatMessage(strings.appealReceivedNotificationLinkText)}
        </Button>
      )
    }
  }
  //
  else if (canBeAppealed) {
    title = formatMessage(strings.appealDeadlineTitle, {
      appealDeadline,
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
