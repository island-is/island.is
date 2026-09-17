import type { FC } from 'react'
import { useIntl } from 'react-intl'

import BlueBox from '@island.is/judicial-system-web/src/components/BlueBox/BlueBox'
import ContextMenuCard from '@island.is/judicial-system-web/src/components/Cards/ContextMenuCard/ContextMenuCard'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import { getDefenderVerdictTimelineItems } from './DefenderVerdictTimelineCard.logic'
import VerdictTimelineBody from './VerdictTimelineBody'

interface Props {
  defendant: Defendant
  // The actions this user may take on the verdict, if any. With none the card
  // is plain; a defender who does not represent this defendant should not be
  // shown a menu they cannot use.
  contextMenuItems?: ContextMenuItem[]
}

/**
 * The defence view of a defendant's verdict timeline: the same service and
 * appeal information the public prosecution office has, plus the appeal actions
 * the viewing defender may take for this defendant. Which bullets that comes to
 * is decided by getDefenderVerdictTimelineItems.
 */
const DefenderVerdictTimelineCard: FC<Props> = (props) => {
  const { defendant, contextMenuItems } = props
  const { verdict } = defendant
  const { formatMessage } = useIntl()

  if (!verdict) {
    return null
  }

  const body = (
    <VerdictTimelineBody
      eyebrow={defendant.name ?? ''}
      items={getDefenderVerdictTimelineItems(verdict, formatMessage)}
    />
  )

  if (contextMenuItems && contextMenuItems.length > 0) {
    return (
      <ContextMenuCard
        title={
          <SectionHeading title="Birting dóms" heading="h4" marginBottom={0} />
        }
        contextMenuItems={contextMenuItems}
        menuLabel={`Valmynd fyrir birtingu dóms ${defendant.name ?? ''}`.trim()}
      >
        {body}
      </ContextMenuCard>
    )
  }

  return (
    <BlueBox>
      <SectionHeading title="Birting dóms" heading="h4" marginBottom={2} />
      {body}
    </BlueBox>
  )
}

export default DefenderVerdictTimelineCard
