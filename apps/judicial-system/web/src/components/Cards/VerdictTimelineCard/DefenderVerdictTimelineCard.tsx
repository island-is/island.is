import type { FC } from 'react'
import { useIntl } from 'react-intl'

import BlueBox from '@island.is/judicial-system-web/src/components/BlueBox/BlueBox'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import { getDefenderVerdictTimelineItems } from './DefenderVerdictTimelineCard.logic'
import VerdictTimelineBody from './VerdictTimelineBody'

interface Props {
  defendant: Defendant
}

/**
 * The defence view of a defendant's verdict timeline: the same service and
 * appeal information the public prosecution office has, without the actions it
 * can take. Which bullets that comes to is decided by
 * getDefenderVerdictTimelineItems.
 */
const DefenderVerdictTimelineCard: FC<Props> = (props) => {
  const { defendant } = props
  const { verdict } = defendant
  const { formatMessage } = useIntl()

  if (!verdict) {
    return null
  }

  return (
    <BlueBox>
      <SectionHeading title="Birting dóms" heading="h4" marginBottom={2} />
      <VerdictTimelineBody
        eyebrow={defendant.name ?? ''}
        items={getDefenderVerdictTimelineItems(verdict, formatMessage)}
      />
    </BlueBox>
  )
}

export default DefenderVerdictTimelineCard
