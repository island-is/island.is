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

const AppealAlertBanner: React.FC<Props> = (props) => {
  const { workingCase } = props
  const { formatMessage } = useIntl()
  const limitedAccess = router.pathname.includes(DEFENDER_ROUTE)

  const {
    courtEndTime,
    appealState,
    isAppealDeadlineExpired,
    accusedAppealDecision,
    prosecutorAppealDecision,
    prosecutorPostponedAppealDate,
    accusedPostponedAppealDate,
  } = workingCase

  let alertTitle,
    alertLinkTitle = '',
    alertLinkHref = '',
    alertDescription

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

  const actor =
    caseAppealedBy === UserRole.Prosecutor
      ? formatMessage(core.prosecutor)
      : formatMessage(core.defender)

  const caseAppealedDate =
    caseAppealedBy === UserRole.Prosecutor
      ? prosecutorPostponedAppealDate ?? ''
      : accusedPostponedAppealDate ?? ''

  if (canCaseBeAppealed) {
    alertTitle = formatMessage(strings.appealTitle, {
      appealDeadline: getAppealEndDate(workingCase.courtEndTime ?? ''),
    })
    alertLinkTitle = formatMessage(strings.appealLinkText)
    alertLinkHref = limitedAccess
      ? `${DEFENDER_APPEAL_ROUTE}/${workingCase.id}`
      : `${APPEAL_ROUTE}/${workingCase.id}`
  } else if (hasCaseBeenAppealed) {
    alertTitle = formatMessage(strings.statementTitle)
    alertDescription = formatMessage(strings.statementDescription, {
      actor: actor,
      appealDate: formatDate(caseAppealedDate, 'PPPp'),
    })
    alertLinkTitle = formatMessage(strings.statementLinkText)
    alertLinkHref = '/krofur'
  }

  return canCaseBeAppealed || hasCaseBeenAppealed ? (
    <AlertBanner
      title={alertTitle}
      description={alertDescription}
      variant="warning"
      link={{
        href: alertLinkHref,
        title: alertLinkTitle,
      }}
    />
  ) : null
}

export default AppealAlertBanner
