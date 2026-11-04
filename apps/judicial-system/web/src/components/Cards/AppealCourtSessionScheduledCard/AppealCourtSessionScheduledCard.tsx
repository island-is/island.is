import type { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { appealCourtSessionTypeNames } from '@island.is/judicial-system/types'
import IconCard from '@island.is/judicial-system-web/src/components/Cards/IconCard/IconCard'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import {
  COURT_OF_APPEALS_NAME,
  getScheduledAppealCourtSessions,
} from './AppealCourtSessionScheduledCard.logic'
import { strings } from './AppealCourtSessionScheduledCard.strings'

interface Props {
  verdictAppealCase: WorkingCase['verdictAppealCase']
}

// The sessions the court of appeals has called in the verdict appeal, on one
// card: an entry per session with its type, date, time and courtroom, the way
// the district court's scheduled card reads. Renders nothing when the parties
// have nothing on their agenda.
const AppealCourtSessionScheduledCard: FC<Props> = ({ verdictAppealCase }) => {
  const sessions = getScheduledAppealCourtSessions(verdictAppealCase)

  if (sessions.length === 0) {
    return null
  }

  return (
    <IconCard
      data={[
        {
          title: strings.scheduled,
          value: sessions.map((session) => (
            <div key={session.id}>
              <Text variant="eyebrow" marginBottom={1} marginTop={2}>
                {formatDate(session.sessionDate, 'PPPp')}
              </Text>
              <Text>{appealCourtSessionTypeNames[session.sessionType]}</Text>
              <Text>
                {COURT_OF_APPEALS_NAME}, {strings.courtRoom} {session.courtRoom}
              </Text>
            </div>
          )),
        },
      ]}
      icon="calendar"
    />
  )
}

export default AppealCourtSessionScheduledCard
