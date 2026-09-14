import type { FC } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { courtSessionTypeNames } from '@island.is/judicial-system/types'
import CaseScheduledCard from '@island.is/judicial-system-web/src/components/Cards/CaseScheduledCard/CaseScheduledCard'
import IconCard from '@island.is/judicial-system-web/src/components/Cards/IconCard/IconCard'
import type {
  CourtSessionType,
  Institution,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { IndictmentDecision } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './IndictmentCaseScheduledCard.strings'

interface Props {
  court: Institution
  indictmentDecision?: IndictmentDecision | null
  courtDate: string
  courtRoom?: string | null
  postponedIndefinitelyExplanation?: string | null
  courtSessionType?: CourtSessionType | null
}

const IndictmentCaseScheduledCard: FC<Props> = (props) => {
  const {
    court,
    indictmentDecision,
    courtDate,
    courtRoom,
    postponedIndefinitelyExplanation,
    courtSessionType,
  } = props
  const { formatMessage } = useIntl()

  return indictmentDecision ? (
    indictmentDecision === IndictmentDecision.POSTPONING ? (
      <IconCard
        data={[
          {
            title: formatMessage(strings.postponingTitle),
            value: (
              <Text marginTop={2}>{postponedIndefinitelyExplanation}</Text>
            ),
          },
        ]}
        icon="calendar"
      />
    ) : indictmentDecision === IndictmentDecision.POSTPONING_UNTIL_VERDICT ? (
      <IconCard
        data={[
          {
            title: formatMessage(strings.schedulingUntilVerdictTitle),
            value: (
              <Text marginTop={2}>
                {formatMessage(strings.schedulingUntilVerdictText)}
              </Text>
            ),
          },
        ]}
        icon="calendar"
      />
    ) : (
      // indictmentDecision === IndictmentDecision.SCHEDULING
      <CaseScheduledCard
        court={court}
        courtDate={courtDate}
        courtRoom={courtRoom}
        title={courtSessionType && courtSessionTypeNames[courtSessionType]}
      />
    )
  ) : (
    <CaseScheduledCard
      court={court}
      courtDate={courtDate}
      courtRoom={courtRoom}
    />
  )
}

export default IndictmentCaseScheduledCard
