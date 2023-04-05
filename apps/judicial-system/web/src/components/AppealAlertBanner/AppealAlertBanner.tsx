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
  appealedByRole: UserRole
  appealedDate: string
  hasBeenAppealed: boolean
  canBeAppealed: boolean
}

const getAppealInfo = (workingCase: TempCase): AppealInfo => {
  const {
    courtEndTime,
    appealState,
    isAppealDeadlineExpired,
    accusedAppealDecision,
    prosecutorAppealDecision,
    prosecutorPostponedAppealDate,
    accusedPostponedAppealDate,
  } = workingCase

  const canCaseBeAppealed =
    courtEndTime &&
    !appealState &&
    !isAppealDeadlineExpired &&
    (accusedAppealDecision === CaseAppealDecision.POSTPONE ||
      prosecutorAppealDecision === CaseAppealDecision.POSTPONE)

  const hasCaseBeenAppealed =
    appealState && appealState === CaseAppealState.Appealed

  const caseAppealedBy = prosecutorPostponedAppealDate
    ? UserRole.Prosecutor
    : UserRole.Defender

  const caseAppealedDate =
    caseAppealedBy === UserRole.Prosecutor
      ? prosecutorPostponedAppealDate ?? ''
      : accusedPostponedAppealDate ?? ''

  return {
    hasBeenAppealed: hasCaseBeenAppealed,
    canBeAppealed: canCaseBeAppealed,
    appealedByRole: caseAppealedBy,
    appealedDate: caseAppealedDate,
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
      appealDeadline: getAppealEndDate(workingCase.courtEndTime ?? ''),
    })
    alertLinkTitle = formatMessage(strings.appealLinkText)
    alertLinkHref = limitedAccess
      ? `${DEFENDER_APPEAL_ROUTE}/${workingCase.id}`
      : `${APPEAL_ROUTE}/${workingCase.id}`
  }

  return canBeAppealed || hasBeenAppealed ? (
    <AlertBanner
      title={alertTitle}
      description={alertDescription}
      variant="warning"
      link={{
        href: alertLinkHref ?? '',
        title: alertLinkTitle ?? '',
      }}
    />
  ) : null
}

export default AppealAlertBanner
