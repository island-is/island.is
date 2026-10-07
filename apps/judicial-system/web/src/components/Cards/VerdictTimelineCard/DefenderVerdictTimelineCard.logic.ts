import type { IntlShape } from 'react-intl'

import {
  formatDate,
  getDefendantVerdictAppealDecisionLabel,
  getServiceRequirementText,
} from '@island.is/judicial-system/formatters'
import type {
  AppealCase,
  Verdict,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import { getProsecutionVerdictAppealItem } from './prosecutionVerdictAppeal.logic'
import type { VerdictTimelineItem } from './VerdictTimelineBody'
import { strings } from './VerdictTimelineCard.strings'

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
  verdictAppealCase?: Pick<AppealCase, 'appealEventLogs'> | null
  formatMessage: IntlShape['formatMessage']
}

/**
 * The bullets a defence user sees about the service and appeal of one verdict.
 * Deliberately leaves out the appeal deadline, which defence users already get
 * from InfoCardClosedIndictment, and everything about enforcement, which is
 * internal to the prosecution.
 */
export const getDefenderVerdictTimelineItems = ({
  defendantId,
  verdict,
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

  // The prosecution may appeal a verdict regardless of what the defendant did,
  // so its appeal is its own bullet rather than one that replaces another.
  const prosecutionAppealItem = getProsecutionVerdictAppealItem(
    verdictAppealCase,
    defendantId,
  )

  if (prosecutionAppealItem) {
    items.push(prosecutionAppealItem)
  }

  return items
}
