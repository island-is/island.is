import { formatAppeal } from '@island.is/judicial-system/formatters'
import {
  isInvestigationCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

export const populateEndOfCourtSessionBookingsIntro = (
  workingCase: Case,
  endOfSessionBookings: string[],
) => {
  const isCaseCompletedWithRuling = !workingCase.isCompletedWithoutRuling

  if (isInvestigationCase(workingCase.type)) {
    if (isCaseCompletedWithRuling) {
      // conclusion intro
      endOfSessionBookings.push(
        'Úrskurðarorðið er lesið í heyranda hljóði.',
        '\n\n',
      )
      // information on appeal decision for defendants
      if (workingCase.sessionArrangements === SessionArrangements.ALL_PRESENT) {
        endOfSessionBookings.push(
          'Dómari kynnir varnaraðila rétt til að kæra úrskurð og um kærufrest, sbr. 193. gr. laga nr. 88/2008.',
          '\n\n',
        )
      }
    }
  } else {
    // for restriction cases this is always populated
    endOfSessionBookings.push(
      'Úrskurðarorðið er lesið í heyranda hljóði.',
      '\n\n',
    )
    endOfSessionBookings.push(
      'Dómari kynnir varnaraðila rétt til að kæra úrskurð og um kærufrest, sbr. 193. gr. laga nr. 88/2008.',
      '\n\n',
    )
  }

  // prosecutor appeal decision
  let prosecutorAppeal = formatAppeal(
    workingCase.prosecutorAppealDecision,
    'Sækjandi',
  )

  if (prosecutorAppeal) {
    prosecutorAppeal = `${prosecutorAppeal} ${
      workingCase.prosecutorAppealAnnouncement ?? ''
    }`
  } else {
    prosecutorAppeal = workingCase.prosecutorAppealAnnouncement ?? ''
  }
  if (prosecutorAppeal) {
    endOfSessionBookings.push(prosecutorAppeal, '\n\n')
  }

  // defendants appeal decision
  const hasMultipleDefendants =
    (workingCase.defendants && workingCase.defendants.length > 1) || false

  let accusedAppeal = formatAppeal(
    workingCase.accusedAppealDecision,
    hasMultipleDefendants ? 'Varnaraðilar' : 'Varnaraðili',
  )

  if (accusedAppeal) {
    accusedAppeal = `${accusedAppeal} ${
      workingCase.accusedAppealAnnouncement ?? ''
    }`
  } else {
    accusedAppeal = workingCase.accusedAppealAnnouncement ?? ''
  }
  if (accusedAppeal) {
    endOfSessionBookings.push(accusedAppeal, '\n\n')
  }
}
