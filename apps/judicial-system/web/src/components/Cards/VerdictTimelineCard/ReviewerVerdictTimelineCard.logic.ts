import {
  formatDate,
  getVerdictAppealDecision,
} from '@island.is/judicial-system/formatters'
import type {
  AppealCase,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getProsecutionVerdictAppealItem } from './prosecutionVerdictAppeal.logic'
import type { VerdictTimelineItem } from './VerdictTimelineBody'
import { withAppealDefender } from './VerdictTimelineCard.logic'

interface ReviewerVerdictTimeline {
  defendant: Defendant
  verdictAppealCase?: Pick<AppealCase, 'appealEventLogs'> | null
  // The prosecution's own deadline to appeal, which runs from the ruling date
  // and is therefore the same for every defendant of the case.
  indictmentAppealDeadline?: string | null
}

/**
 * The bullets the public prosecution reviewer sees about one defendant while
 * deciding whether to appeal.
 *
 * Deliberately not the same list as the public prosecution office's card. The
 * reviewer is looking at their own decision, so what matters is where the
 * defendant stands and how long the prosecution has left - not the service of
 * the verdict, which the page already shows in its own alert, nor the
 * defendant's deadline, which is not the reviewer's to keep.
 */
export const getReviewerVerdictTimelineItems = ({
  defendant,
  verdictAppealCase,
  indictmentAppealDeadline,
}: ReviewerVerdictTimeline): VerdictTimelineItem[] => {
  const items: VerdictTimelineItem[] = []
  const { verdict } = defendant

  // Where the defendant stands, until they appeal - at which point the appeal
  // is the stance and takes its place. No stance recorded yet means there is
  // nothing to say, rather than a bullet saying so.
  if (verdict?.appealDate) {
    items.push({
      text: withAppealDefender(
        `Dómfelldi áfrýjaði ${formatDate(verdict.appealDate)}`,
        defendant.appealDefenderName,
      ),
    })
  } else if (verdict?.appealDecision) {
    items.push({
      text: `Afstaða dómfellda: ${getVerdictAppealDecision(
        verdict.appealDecision,
      )}`,
    })
  }

  // Once the prosecution has appealed, its deadline has done its job and the
  // appeal replaces it.
  const prosecutionAppealItem = getProsecutionVerdictAppealItem(
    verdictAppealCase,
    defendant.id,
  )

  if (prosecutionAppealItem) {
    items.push(prosecutionAppealItem)
  } else if (indictmentAppealDeadline) {
    items.push({
      text: `Áfrýjunarfrestur ákæruvalds: ${formatDate(
        indictmentAppealDeadline,
      )}`,
    })
  }

  return items
}
