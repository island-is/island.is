import type { FC } from 'react'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'

import {
  formatDate,
  getDefendantVerdictAppealDecisionLabel,
  getServiceRequirementText,
} from '@island.is/judicial-system/formatters'
import BlueBox from '@island.is/judicial-system-web/src/components/BlueBox/BlueBox'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'

import type { VerdictTimelineItem } from './VerdictTimelineBody'
import VerdictTimelineBody from './VerdictTimelineBody'
import { strings } from './VerdictTimelineCard.strings'

interface Props {
  defendant: Defendant
}

/**
 * The defence view of a defendant's verdict timeline: the same service and
 * appeal information the public prosecution office has, without the actions it
 * can take. It deliberately leaves out the appeal deadline, which defence users
 * already get from InfoCardClosedIndictment, and everything about enforcement,
 * which is internal to the prosecution.
 */
const DefenderVerdictTimelineCard: FC<Props> = (props) => {
  const { defendant } = props
  const { verdict } = defendant
  const { formatMessage } = useIntl()

  const textItems = useMemo(() => {
    const items: VerdictTimelineItem[] = []

    if (!verdict) {
      return items
    }

    // Once a verdict that had to be served has been served, the service date
    // says all there is to say. Until then - and when no service was needed at
    // all - the requirement itself is what the defence needs to know.
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

    // The stance the defendant took at service only matters while it is still
    // open which way they will go, so an appeal takes its place in the list.
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
  }, [formatMessage, verdict])

  if (!verdict) {
    return null
  }

  return (
    <BlueBox>
      <SectionHeading title="Birting dóms" heading="h4" marginBottom={2} />
      <VerdictTimelineBody eyebrow={defendant.name ?? ''} items={textItems} />
    </BlueBox>
  )
}

export default DefenderVerdictTimelineCard
