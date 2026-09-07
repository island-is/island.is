import type { IntlShape } from 'react-intl'

import {
  formatDate,
  getDefendantVerdictAppealDecisionLabel,
  getServiceRequirementText,
} from '@island.is/judicial-system/formatters'
import type { Verdict } from '@island.is/judicial-system-web/src/graphql/schema'
import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import type { VerdictTimelineItem } from './VerdictTimelineBody'
import { strings } from './VerdictTimelineCard.strings'

/**
 * The bullets a defence user sees about the service and appeal of one verdict.
 * Deliberately leaves out the appeal deadline, which defence users already get
 * from InfoCardClosedIndictment, and everything about enforcement, which is
 * internal to the prosecution.
 */
export const getDefenderVerdictTimelineItems = (
  verdict: Verdict,
  formatMessage: IntlShape['formatMessage'],
): VerdictTimelineItem[] => {
  const items: VerdictTimelineItem[] = []

  // Once a verdict that had to be served has been served, the service date says
  // all there is to say. Until then - and when no service was needed at all -
  // the requirement itself is what the defence needs to know.
  if (
    verdict.serviceRequirement === ServiceRequirement.REQUIRED &&
    verdict.serviceDate
  ) {
    items.push({
      text: formatMessage(strings.defendantVerdictViewedDate, {
        date: formatDate(verdict.serviceDate),
      }),
    })
  } else if (verdict.serviceRequirement) {
    const serviceRequirementText = getServiceRequirementText(
      verdict.serviceRequirement,
    )

    if (serviceRequirementText) {
      items.push({ text: serviceRequirementText })
    }
  }

  // The stance the defendant took at service only matters while it is still open
  // which way they will go, so an appeal takes its place in the list.
  if (verdict.appealDate) {
    items.push({
      text: `Dómfelldi áfrýjaði ${formatDate(verdict.appealDate)}`,
      tone: 'critical',
    })
  } else if (verdict.appealDecision) {
    const appealDecisionLabel = getDefendantVerdictAppealDecisionLabel(
      verdict.appealDecision,
    )

    if (appealDecisionLabel) {
      items.push({ text: appealDecisionLabel })
    }
  }

  return items
}
