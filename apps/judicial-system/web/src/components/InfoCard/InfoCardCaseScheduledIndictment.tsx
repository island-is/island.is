import React from 'react'
import { useIntl } from 'react-intl'

import { Institution } from '../../graphql/schema'
import InfoCard from './InfoCard'
import InfoCardCaseScheduled from './InfoCardCaseScheduled'
import { strings } from './InfoCardCaseScheduledIndictment.strings'

interface Props {
  court: Institution
  courtDate: string
  courtRoom?: string | null
  postponedIndefinitelyExplanation?: string | null
}

const InfoCardCaseScheduledIndictment: React.FC<Props> = (props) => {
  const { court, courtDate, courtRoom, postponedIndefinitelyExplanation } =
    props
  const { formatMessage } = useIntl()

  return postponedIndefinitelyExplanation ? (
    <InfoCard
      data={[
        {
          title: formatMessage(strings.postponed),
          value: postponedIndefinitelyExplanation,
        },
      ]}
      icon="calendar"
    />
  ) : (
    <InfoCardCaseScheduled
      court={court}
      courtDate={courtDate}
      courtRoom={courtRoom}
    />
  )
}

export default InfoCardCaseScheduledIndictment
