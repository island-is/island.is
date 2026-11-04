import type { FC } from 'react'

import { Box } from '@island.is/island-ui/core'
import { appealCourtSessionTypeNames } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import {
  COURT_OF_APPEALS_NAME,
  getScheduledAppealCourtSessions,
} from './AppealCourtSessionScheduledCards.logic'
import CaseScheduledCard from './CaseScheduledCard'

interface Props {
  verdictAppealCase: WorkingCase['verdictAppealCase']
}

// One card per session the court of appeals has called in the verdict appeal,
// the same card the district court's sessions get. Renders nothing when the
// parties have nothing on their agenda.
const AppealCourtSessionScheduledCards: FC<Props> = ({ verdictAppealCase }) => {
  const sessions = getScheduledAppealCourtSessions(verdictAppealCase)

  if (sessions.length === 0) {
    return null
  }

  return (
    <div className={stack({ gap: 2 })}>
      {sessions.map((session) => (
        <Box component="section" key={session.id}>
          <CaseScheduledCard
            courtName={COURT_OF_APPEALS_NAME}
            courtDate={session.sessionDate}
            courtRoom={session.courtRoom}
            title={appealCourtSessionTypeNames[session.sessionType]}
          />
        </Box>
      ))}
    </div>
  )
}

export default AppealCourtSessionScheduledCards
