import {
  isInvestigationCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../models'

function maskPart(part: string): string {
  let sum = 0

  for (let i = 0; i < part.length; i++) {
    sum += part.charCodeAt(i)
  }
  return String.fromCharCode(65 + (sum % 26))
}

function maskName(name?: string): string | undefined {
  if (!name) {
    return name
  }

  const parts = name.split(' ')

  if (parts.length < 1) {
    return name
  }

  const firstLetter = maskPart(parts[0])

  if (parts.length < 2) {
    return firstLetter
  }

  const secondLetter = maskPart(parts[1])

  return `${firstLetter}${secondLetter}`
}

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
      accusedName: maskName(theCase.accusedName),
      defenderName: theCase.defenderName,
      defenderEmail: theCase.defenderEmail,
      defenderPhoneNumber: theCase.defenderPhoneNumber,
      defenderIsSpokesperson: theCase.defenderIsSpokesperson,
      court: theCase.court,
      requestedCourtDate: theCase.requestedCourtDate,
      courtCaseNumber: theCase.courtCaseNumber,
      sessionArrangements: theCase.sessionArrangements,
      courtDate: theCase.courtDate,
      courtRoom: theCase.courtRoom,
      courtEndTime: theCase.courtEndTime,
      decision: theCase.decision,
      validToDate: theCase.validToDate,
      isValidToDateInThePast: theCase.isValidToDateInThePast,
      creatingProsecutor: theCase.creatingProsecutor,
      prosecutor: theCase.prosecutor,
      rulingDate: theCase.rulingDate,
      accusedAppealDecision: theCase.accusedAppealDecision,
      prosecutorAppealDecision: theCase.prosecutorAppealDecision,
      accusedPostponedAppealDate: theCase.accusedPostponedAppealDate,
      prosecutorPostponedAppealDate: theCase.prosecutorPostponedAppealDate,
      judge: theCase.judge,
      registrar: theCase.registrar,
      parentCase: theCase.parentCase && {
        id: theCase.parentCase.id,
        decision: theCase.parentCase.decision,
      },
      isMasked: true,
    } as Case
  }

  return theCase
}

export function maskCaseByUser(theCase: Case, user: User): Case {
  if (
    user.role === UserRole.PROSECUTOR ||
    (user.role === UserRole.JUDGE && user.id === theCase.judge?.id) ||
    (user.role === UserRole.REGISTRAR && user.id === theCase.registrar?.id)
  ) {
    return theCase
  }

  return maskCase(theCase)
}
