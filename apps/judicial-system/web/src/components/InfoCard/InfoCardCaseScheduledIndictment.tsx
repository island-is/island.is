import React from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'

import { IndictmentDecision, Institution } from '../../graphql/schema'
import InfoCard from './InfoCard'
import InfoCardCaseScheduled from './InfoCardCaseScheduled'
import { strings } from './InfoCardCaseScheduledIndictment.strings'

interface Props {
  court: Institution
  indictmentDecision?: IndictmentDecision | null
  courtDate: string
  courtRoom?: string | null
  postponedIndefinitelyExplanation?: string | null
}

const InfoCardCaseScheduledIndictment: FC<Props> = (props) => {
  const {
    court,
    indictmentDecision,
    courtDate,
    courtRoom,
    postponedIndefinitelyExplanation,
  } = props
  const { formatMessage } = useIntl()

  return indictmentDecision ? (
    indictmentDecision === IndictmentDecision.POSTPONING ? (
      <InfoCard
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
      <InfoCard
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
      <InfoCardCaseScheduled
        court={court}
        courtDate={courtDate}
        courtRoom={courtRoom}
        title={formatMessage(strings.schedulingTitle)}
      />
    )
  ) : (
    <InfoCardCaseScheduled
      court={court}
      courtDate={courtDate}
      courtRoom={courtRoom}
    />
  )
}

export default InfoCardCaseScheduledIndictment
