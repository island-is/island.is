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
      defendants: theCase.defendants?.map((d) => ({
        nationalId: '0000000000',
        name: maskName(d.name),
      })),
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
      initialRulingDate: theCase.initialRulingDate,
      accusedAppealDecision: theCase.accusedAppealDecision,
      prosecutorAppealDecision: theCase.prosecutorAppealDecision,
      accusedPostponedAppealDate: theCase.accusedPostponedAppealDate,
      prosecutorPostponedAppealDate: theCase.prosecutorPostponedAppealDate,
      judge: theCase.judge,
      registrar: theCase.registrar,
      courtRecordSignatory: theCase.courtRecordSignatory,
      courtRecordSignatureDate: theCase.courtRecordSignatureDate,
      parentCase: theCase.parentCase && {
        id: theCase.parentCase.id,
        created: theCase.parentCase.created,
        modified: theCase.parentCase.modified,
        type: theCase.parentCase.type,
        state: theCase.parentCase.state,
        policeCaseNumber: theCase.parentCase.policeCaseNumber,
        defenderName: theCase.parentCase.defenderName,
        defenderEmail: theCase.parentCase.defenderEmail,
        defenderPhoneNumber: theCase.parentCase.defenderPhoneNumber,
        defenderIsSpokesperson: theCase.parentCase.defenderIsSpokesperson,
        court: theCase.parentCase.court,
        requestedCourtDate: theCase.parentCase.requestedCourtDate,
        courtCaseNumber: theCase.parentCase.courtCaseNumber,
        sessionArrangements: theCase.parentCase.sessionArrangements,
        courtDate: theCase.parentCase.courtDate,
        courtRoom: theCase.parentCase.courtRoom,
        courtEndTime: theCase.parentCase.courtEndTime,
        decision: theCase.parentCase.decision,
        validToDate: theCase.parentCase.validToDate,
        isValidToDateInThePast: theCase.parentCase.isValidToDateInThePast,
        creatingProsecutor: theCase.parentCase.creatingProsecutor,
        prosecutor: theCase.parentCase.prosecutor,
        rulingDate: theCase.parentCase.rulingDate,
        initialRulingDate: theCase.parentCase.initialRulingDate,
        accusedAppealDecision: theCase.parentCase.accusedAppealDecision,
        prosecutorAppealDecision: theCase.parentCase.prosecutorAppealDecision,
        accusedPostponedAppealDate:
          theCase.parentCase.accusedPostponedAppealDate,
        prosecutorPostponedAppealDate:
          theCase.parentCase.prosecutorPostponedAppealDate,
        judge: theCase.parentCase.judge,
        registrar: theCase.parentCase.registrar,
        courtRecordSignatory: theCase.parentCase.courtRecordSignatory,
        courtRecordSignatureDate: theCase.parentCase.courtRecordSignatureDate,
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
