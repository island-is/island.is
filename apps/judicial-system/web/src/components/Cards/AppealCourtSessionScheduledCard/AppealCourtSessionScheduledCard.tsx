import type { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { appealCourtSessionTypeNames } from '@island.is/judicial-system/types'
import IconCard from '@island.is/judicial-system-web/src/components/Cards/IconCard/IconCard'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import { getBookedAppealCourtSessions } from './AppealCourtSessionScheduledCard.logic'

interface Props {
  verdictAppealCase: WorkingCase['verdictAppealCase']
}

// The sessions the court of appeals has called in the verdict appeal, on one
// card: an entry per session with its type, date, time and courtroom, the way
// the district court's scheduled card reads. A log in calendar order, earliest
// first, so an entry never leaves the card once the session is held. Renders
// nothing while nothing is booked.
const AppealCourtSessionScheduledCard: FC<Props> = ({ verdictAppealCase }) => {
  const sessions = getBookedAppealCourtSessions(verdictAppealCase)

  if (sessions.length === 0) {
    return null
  }

  return (
    <IconCard
      data={[
        {
          title: 'Á dagskrá',
          value: sessions.map((session) => (
            <div key={session.id}>
              <Text variant="eyebrow" marginBottom={1} marginTop={2}>
                {formatDate(session.sessionDate, 'PPPp')}
              </Text>
              <Text>{appealCourtSessionTypeNames[session.sessionType]}</Text>
              <Text>{`Dómsalur ${session.courtRoom}`}</Text>
            </div>
          )),
        },
      ]}
      icon="calendar"
    />
  )
}

export default AppealCourtSessionScheduledCard
