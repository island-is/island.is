import { formatAppeal } from '@island.is/judicial-system/formatters'
import { isInvestigationCase } from '@island.is/judicial-system/types'
import {
  AppealDecisionPartyRole,
  Case,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  caseLevelAppealAnnouncement,
  caseLevelAppealDecision,
} from '@island.is/judicial-system-web/src/utils/utils'

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
  const prosecutorAppealAnnouncement =
    caseLevelAppealAnnouncement(
      workingCase,
      AppealDecisionPartyRole.PROSECUTOR,
    ) ?? ''
  let prosecutorAppeal = formatAppeal(
    caseLevelAppealDecision(workingCase, AppealDecisionPartyRole.PROSECUTOR),
    'Sækjandi',
  )

  if (prosecutorAppeal) {
    prosecutorAppeal = `${prosecutorAppeal} ${prosecutorAppealAnnouncement}`
  } else {
    prosecutorAppeal = prosecutorAppealAnnouncement
  }
  if (prosecutorAppeal) {
    endOfSessionBookings.push(prosecutorAppeal, '\n\n')
  }

  // defendants appeal decision
  const hasMultipleDefendants =
    (workingCase.defendants && workingCase.defendants.length > 1) || false

  const accusedAppealAnnouncement =
    caseLevelAppealAnnouncement(workingCase, AppealDecisionPartyRole.DEFENDANT) ??
    ''
  let accusedAppeal = formatAppeal(
    caseLevelAppealDecision(workingCase, AppealDecisionPartyRole.DEFENDANT),
    hasMultipleDefendants ? 'Varnaraðilar' : 'Varnaraðili',
  )

  if (accusedAppeal) {
    accusedAppeal = `${accusedAppeal} ${accusedAppealAnnouncement}`
  } else {
    accusedAppeal = accusedAppealAnnouncement
  }
  if (accusedAppeal) {
    endOfSessionBookings.push(accusedAppeal, '\n\n')
  }
}
