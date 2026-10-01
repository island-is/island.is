import type { FC } from 'react'

import BlueBox from '@island.is/judicial-system-web/src/components/BlueBox/BlueBox'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import { getCourtOfAppealsVerdictTimelineItems } from './CourtOfAppealsVerdictTimelineCard.logic'
import VerdictTimelineBody from './VerdictTimelineBody'

interface Props {
  defendant: Defendant
}

/**
 * The Court of Appeals' read-only view of one defendant's verdict: how it was
 * served, how long they had to appeal, and what they did about it.
 *
 * No menu and no actions. By the time a case reaches this court the decisions
 * this card describes have all been taken.
 */
const CourtOfAppealsVerdictTimelineCard: FC<Props> = ({ defendant }) => {
  const items = getCourtOfAppealsVerdictTimelineItems(defendant)

  // Nothing is known about this defendant's verdict yet, so an empty card
  // would say less than no card.
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

export default CourtOfAppealsVerdictTimelineCard
