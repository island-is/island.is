import {
  completedCaseStates,
  isInvestigationCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../models'

export function maskCase(theCase: Case): Case {
  if (isInvestigationCase(theCase.type)) {
    return {
      id: theCase.id,
      created: theCase.created,
      modified: theCase.modified,
      type: theCase.type,
      state: theCase.state,
      policeCaseNumber: theCase.policeCaseNumber,
      accusedNationalId: '0000000000',
      accusedName: 'X',
      defenderName: theCase.defenderName,
      defenderEmail: theCase.defenderEmail,
      defenderPhoneNumber: theCase.defenderPhoneNumber,
      defenderIsSpokesperson: theCase.defenderIsSpokesperson,
      court: theCase.court,
      courtCaseNumber: theCase.courtCaseNumber,
      courtEndTime: theCase.courtEndTime,
      decision: theCase.decision,
      validToDate: theCase.validToDate,
      isValidToDateInThePast: theCase.isValidToDateInThePast,
      prosecutor: theCase.prosecutor,
      rulingDate: theCase.rulingDate,
      accusedAppealDecision: theCase.accusedAppealDecision,
      prosecutorAppealDecision: theCase.prosecutorAppealDecision,
      accusedPostponedAppealDate: theCase.accusedPostponedAppealDate,
      prosecutorPostponedAppealDate: theCase.prosecutorPostponedAppealDate,
      judge: theCase.judge,
      parentCase: theCase.parentCase && { id: theCase.parentCase.id },
      isMasked: true,
    } as Case
  }

  return theCase
}

export function maskCaseByUser(theCase: Case, user: User): Case {
  if (
    !completedCaseStates.includes(theCase.state) ||
    user.role === UserRole.PROSECUTOR ||
    (user.role === UserRole.JUDGE && user.id === theCase.judge?.id) ||
    (user.role === UserRole.REGISTRAR && user.id === theCase.registrar?.id)
  ) {
    return theCase
  }

  return maskCase(theCase)
}
