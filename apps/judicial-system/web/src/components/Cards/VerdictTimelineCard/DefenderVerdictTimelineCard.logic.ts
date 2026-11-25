import type { IntlShape } from 'react-intl'

import {
  formatDate,
  getDefendantVerdictAppealDecisionLabel,
  getServiceRequirementText,
} from '@island.is/judicial-system/formatters'
import { findFiledAppealStatementEvent } from '@island.is/judicial-system/types'
import { getAppealExpirationInfo } from '@island.is/judicial-system-web/src/components/InfoCard/DefendantInfo/DefendantInfo.logic'
import type {
  AppealCase,
  Defendant,
  Verdict,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import { getOpenAppealStatementDeadlineItem } from './appealStatementDeadlineItem.logic'
import { getProsecutionVerdictAppealItem } from './prosecutionVerdictAppeal.logic'
import type { VerdictTimelineItem } from './VerdictTimelineBody'
import { strings } from './VerdictTimelineCard.strings'

// Names the bullet that shows where the defendant stands on the verdict: the
// stance they took, or the appeal that came of it.
const STANCE_ITEM_ID = 'stance'

/**
 * Whether there is anything yet to tell the defence about a verdict. Until the
 * public prosecution office has decided whether the verdict must be served, the
 * timeline has no first entry, so the card is not shown at all rather than shown
 * empty. Decided per defendant, since each has their own verdict.
 */
export const hasVerdictServiceDecision = (
  verdict?: Pick<Verdict, 'serviceRequirement'> | null,
): boolean => Boolean(verdict?.serviceRequirement)

interface DefenderVerdictTimeline {
  defendantId: string
  verdict: Verdict
  verdictAppealDeadline?: Defendant['verdictAppealDeadline']
  isVerdictAppealDeadlineExpired?: Defendant['isVerdictAppealDeadlineExpired']
  verdictAppealCase?: Pick<
    AppealCase,
    'appealState' | 'appealEventLogs' | 'statementDeadlines'
  > | null
  formatMessage: IntlShape['formatMessage']
}

/**
 * The bullets a defence user sees about the service and appeal of one verdict.
 * Leaves out enforcement details, which are internal to the prosecution.
 */
export const getDefenderVerdictTimelineItems = ({
  defendantId,
  verdict,
  verdictAppealDeadline,
  isVerdictAppealDeadlineExpired,
  verdictAppealCase,
  formatMessage,
}: DefenderVerdictTimeline): VerdictTimelineItem[] => {
  const items: VerdictTimelineItem[] = []

  // Once a verdict that had to be served has been served, the service date says
  // all there is to say. Until then - and when no service was needed at all -
  // the requirement itself is what the defence needs to know.
  if (
    verdict.serviceRequirement === ServiceRequirement.REQUIRED &&
    verdict.serviceDate
  ) {
    items.push({
      text: formatMessage(
        {
          id: strings.defendantVerdictViewedDate,
          defaultMessage: strings.defendantVerdictViewedDate,
        },
        {
          date: formatDate(verdict.serviceDate),
        },
      ),
    })
  } else if (verdict.serviceRequirement) {
    const serviceRequirementText = getServiceRequirementText(
      verdict.serviceRequirement,
    )

    if (serviceRequirementText) {
      items.push({ text: serviceRequirementText })
    }
  }

  if (verdictAppealDeadline) {
    const appealExpirationInfo = getAppealExpirationInfo({
      verdictAppealDeadline,
      isVerdictAppealDeadlineExpired,
    })

    items.push({
      text: formatMessage(appealExpirationInfo.message, {
        appealExpirationDate: appealExpirationInfo.date,
        deadlineType: verdict.isDefaultJudgement
          ? 'Endurupptökufrestur'
          : 'Áfrýjunarfrestur',
      }),
    })
  }

  // The stance the defendant took at service only matters while it is still open
  // which way they will go, so an appeal takes its place in the list. It is the
  // same bullet either way, so filing or withdrawing an appeal swaps the text
  // in place.
  if (verdict.appealDate) {
    items.push({
      id: STANCE_ITEM_ID,
      text: `Dómfelldi áfrýjaði ${formatDate(verdict.appealDate)}`,
      tone: 'critical',
    })
  } else if (verdict.appealDecision) {
    const appealDecisionLabel = getDefendantVerdictAppealDecisionLabel(
      verdict.appealDecision,
    )

    if (appealDecisionLabel) {
      items.push({ id: STANCE_ITEM_ID, text: appealDecisionLabel })
    }
  }

  // The prosecution may appeal a verdict regardless of what the defendant did,
  // so its appeal is its own bullet rather than one that replaces another.
  const prosecutionAppealItem = getProsecutionVerdictAppealItem(
    verdictAppealCase,
    defendantId,
  )

  if (prosecutionAppealItem) {
    items.push(prosecutionAppealItem)
  }

  // Greinargerð: once the party has filed, the sent date replaces the deadline
  // line. Completed / withdrawn appeals leave this off the card for now.
  const statementEvent = findFiledAppealStatementEvent(
    verdictAppealCase?.appealEventLogs,
    { defendantId },
  )

  if (statementEvent) {
    // Filed status does not require a portal deadline — Landsréttur can
    // record a statement received outside the system.
    const sentDate = formatDate(statementEvent.created)

    items.push({
      text: sentDate ? `Greinargerð send ${sentDate}` : 'Greinargerð send',
    })
  } else {
    const statementDeadlineItem = getOpenAppealStatementDeadlineItem(
      verdictAppealCase,
      { defendantId },
    )

    if (statementDeadlineItem) {
      items.push(statementDeadlineItem)
    }
  }

  return items
}
