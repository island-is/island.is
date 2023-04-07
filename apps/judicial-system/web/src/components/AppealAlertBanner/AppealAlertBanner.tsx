import router from 'next/router'
import React from 'react'
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
  DEFENDER_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { CaseAppealDecision } from '@island.is/judicial-system/types'

import { strings } from './AppealAlertBanner.strings'

interface Props {
  workingCase: TempCase
}

interface AppealInfo {
  canBeAppealed: boolean
  hasBeenAppealed: boolean
  appealDeadline?: string
  appealedByRole?: UserRole
  appealedDate?: string
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

  return {
    hasBeenAppealed,
    canBeAppealed,
    appealedByRole,
    appealedDate,
    appealDeadline,
  } as AppealInfo
}

const AppealAlertBanner: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const limitedAccess = router.pathname.includes(DEFENDER_ROUTE)

  const { workingCase } = props
  const {
    appealedByRole,
    appealedDate,
    canBeAppealed,
    hasBeenAppealed,
    appealDeadline,
  } = getAppealInfo(workingCase)

  let alertTitle, alertLinkTitle, alertLinkHref, alertDescription

  if (hasBeenAppealed) {
    alertTitle = formatMessage(strings.statementTitle)
    alertDescription = formatMessage(strings.statementDescription, {
      actor:
        appealedByRole === UserRole.Prosecutor
          ? formatMessage(core.prosecutor)
          : formatMessage(core.defender),
      appealDate: formatDate(appealedDate, 'PPPp'),
    })
    alertLinkTitle = formatMessage(strings.statementLinkText)
    alertLinkHref = '/krofur'
  } else if (canBeAppealed) {
    alertTitle = formatMessage(strings.appealTitle, {
      appealDeadline,
    })
    alertLinkTitle = formatMessage(strings.appealLinkText)
    alertLinkHref = limitedAccess
      ? `${DEFENDER_APPEAL_ROUTE}/${workingCase.id}`
      : `${APPEAL_ROUTE}/${workingCase.id}`
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
