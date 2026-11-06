import type { FC } from 'react'

import BlueBox from '@island.is/judicial-system-web/src/components/BlueBox/BlueBox'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import type {
  AppealCase,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getReviewerVerdictTimelineItems } from './ReviewerVerdictTimelineCard.logic'
import VerdictTimelineBody from './VerdictTimelineBody'

interface Props {
  defendant: Defendant
  verdictAppealCase?: Pick<AppealCase, 'appealEventLogs'> | null
  indictmentAppealDeadline?: string | null
}

/**
 * The public prosecution reviewer's read-only view of one defendant's verdict:
 * their stance and the prosecution's deadline, or the appeal once it is made.
 *
 * No menu and no actions - the reviewer appeals by making the review decision
 * further down the page, not from here.
 */
const ReviewerVerdictTimelineCard: FC<Props> = (props) => {
  const { defendant, verdictAppealCase, indictmentAppealDeadline } = props

  const items = getReviewerVerdictTimelineItems({
    defendant,
    verdictAppealCase,
    indictmentAppealDeadline,
  })

  // Nothing is known about this defendant's verdict yet, so an empty card would
  // say less than no card.
  if (items.length === 0) {
    return null
  }

  return (
    <BlueBox>
      <SectionHeading
        title={defendant.name ?? ''}
        heading="h4"
        variant="h4"
        marginBottom={2}
      />
      <VerdictTimelineBody items={items} />
    </BlueBox>
  )
}

export default ReviewerVerdictTimelineCard
