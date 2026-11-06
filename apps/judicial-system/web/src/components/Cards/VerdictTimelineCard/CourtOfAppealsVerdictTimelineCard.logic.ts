import {
  formatDate,
  getServiceRequirementText,
  getVerdictAppealDecision,
  getVerdictServiceStatusText,
} from '@island.is/judicial-system/formatters'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import type { VerdictTimelineItem } from './VerdictTimelineBody'

/**
 * What the Court of Appeals is told about one defendant's verdict.
 *
 * The court is reading a history, not keeping a deadline of its own, so every
 * bullet is read only and none of them is about the prosecution's decision to
 * appeal - that decision is already made by the time a case reaches here.
 *
 * Close to the defence card, which also reads the service of the verdict, with
 * the reviewer card's line for where the defendant stands. It is its own list
 * because the court needs both halves and neither of those cards shows the
 * defendant's own deadline.
 */
export const getCourtOfAppealsVerdictTimelineItems = (
  defendant: Pick<Defendant, 'verdict' | 'verdictAppealDeadline'>,
): VerdictTimelineItem[] => {
  const items: VerdictTimelineItem[] = []
  const { verdict } = defendant

  // Every step stays, unlike the cards the parties see. Those are read by
  // someone deciding what to do next, so a later fact replaces the one it
  // settles. This is read by a court reconstructing what happened, and each
  // step is a fact in its own right.
  if (verdict?.serviceRequirement) {
    const serviceRequirementText = getServiceRequirementText(
      verdict.serviceRequirement,
    )

    if (serviceRequirementText) {
      items.push({ text: serviceRequirementText })
    }
  }

  if (verdict?.serviceDate) {
    const manner = verdict.serviceStatus
      ? ` – ${getVerdictServiceStatusText(verdict.serviceStatus)}`
      : ''

    items.push({
      text: `Dómur birtur ${formatDate(verdict.serviceDate)}${manner}`,
    })
  }

  // The defendant's own deadline, not the prosecution's. It runs from service
  // rather than from the ruling, so it is per defendant and the court sees it
  // beside the stance it explains.
  if (defendant.verdictAppealDeadline) {
    items.push({
      text: `Áfrýjunarfrestur ákærða er til ${formatDate(
        defendant.verdictAppealDeadline,
      )}`,
    })
  }

  // The stance taken at service, and then what was done. Both: taking the
  // appeal window and then using it are two steps, and the court is reading
  // the sequence.
  if (verdict?.appealDecision) {
    items.push({
      text: `Afstaða dómfellda: ${getVerdictAppealDecision(
        verdict.appealDecision,
      )}`,
    })
  }

  if (verdict?.appealDate) {
    items.push({ text: `Dómfelldi áfrýjaði ${formatDate(verdict.appealDate)}` })
  }

  return items
}
