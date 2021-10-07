import each from 'jest-each'

import {
  AccusedPleaDecision,
  CaseAppealDecision,
  CaseDecision,
  CaseGender,
  CaseState,
  CaseType,
  InstitutionType,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../models'
import { maskCase, maskCaseByUser } from './case.mask'

function createCase(type: CaseType): Case {
  const baseCase: Case = {
    id: '-',
    created: '-',
    modified: '-',
    type,
    description: '-',
    state: CaseState.DISMISSED,
    policeCaseNumber: '-',
    accusedNationalId: '-',
    accusedName: '-',
    accusedAddress: '-',
    accusedGender: CaseGender.FEMALE,
    defenderName: '-',
    defenderEmail: '-',
    defenderPhoneNumber: '-',
    sendRequestToDefender: true,
    defenderIsSpokesperson: true,
    court: undefined,
    leadInvestigator: '-',
    arrestDate: '-',
    requestedCourtDate: '-',
    translator: '-',
    requestedValidToDate: '-',
    demands: '-',
    lawsBroken: '-',
    legalBasis: '-',
    custodyProvisions: [],
    requestedCustodyRestrictions: [],
    requestedOtherRestrictions: '-',
    caseFacts: '-',
    legalArguments: '-',
    requestProsecutorOnlySession: true,
    prosecutorOnlySessionRequest: '-',
    comments: '-',
    caseFilesComments: '-',
    prosecutor: undefined,
    sharedWithProsecutorsOffice: undefined,
    courtCaseNumber: '-',
    sessionArrangements: SessionArrangements.ALL_PRESENT,
    courtDate: '-',
    courtLocation: '-',
    courtRoom: '-',
    courtStartDate: '-',
    courtEndTime: '-',
    isClosedCourtHidden: true,
    courtAttendees: '-',
    prosecutorDemands: '-',
    courtDocuments: [],
    isAccusedRightsHidden: true,
    accusedPleaDecision: AccusedPleaDecision.ACCEPT,
    accusedPleaAnnouncement: '-',
    litigationPresentations: '-',
    courtCaseFacts: '-',
    courtLegalArguments: '-',
    ruling: '-',
    decision: CaseDecision.DISMISSING,
    validToDate: '-',
    isValidToDateInThePast: true,
    custodyRestrictions: [],
    otherRestrictions: '-',
    isolationToDate: '-',
    conclusion: '-',
    accusedAppealDecision: CaseAppealDecision.ACCEPT,
    accusedAppealAnnouncement: '-',
    prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
    prosecutorAppealAnnouncement: '-',
    accusedPostponedAppealDate: '-',
    prosecutorPostponedAppealDate: '-',
    isAppealDeadlineExpired: true,
    isAppealGracePeriodExpired: true,
    rulingDate: '-',
    judge: undefined,
    registrar: undefined,
    parentCase: undefined,
    childCase: undefined,
    notifications: [],
    caseFiles: [],
  }

  return {
    ...baseCase,
    court: {
      id: '-',
      created: '-',
      modified: '-',
      type: InstitutionType.COURT,
      name: '-',
    },
    prosecutor: {
      id: '-',
      created: '-',
      modified: '-',
      nationalId: '-',
      name: '-',
      title: '-',
      email: '-',
      mobileNumber: '-',
      role: UserRole.PROSECUTOR,
      active: true,
    },
    sharedWithProsecutorsOffice: {
      id: '-',
      created: '-',
      modified: '-',
      type: InstitutionType.PROSECUTORS_OFFICE,
      name: '-',
    },
    judge: {
      id: '-',
      created: '-',
      modified: '-',
      nationalId: '-',
      name: '-',
      title: '-',
      email: '-',
      mobileNumber: '-',
      role: UserRole.JUDGE,
      active: true,
    },
    registrar: {
      id: '-',
      created: '-',
      modified: '-',
      nationalId: '-',
      name: '-',
      title: '-',
      email: '-',
      mobileNumber: '-',
      role: UserRole.REGISTRAR,
      active: true,
    },
    parentCase: baseCase,
    childCase: baseCase,
    notifications: [],
    caseFiles: [],
    isMasked: false,
  }
}

describe('Mask Case', () => {
  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
  `.it('should not mask $type cases', ({ type }) => {
    const theCase = createCase(type)

    const res = maskCase(theCase)

    expect(res).toBe(theCase)
  })

  each`
    type
    ${CaseType.SEARCH_WARRANT}
    ${CaseType.BANKING_SECRECY_WAIVER}
    ${CaseType.PHONE_TAPPING}
    ${CaseType.TELECOMMUNICATIONS}
    ${CaseType.TRACKING_EQUIPMENT}
    ${CaseType.PSYCHIATRIC_EXAMINATION}
    ${CaseType.SOUND_RECORDING_EQUIPMENT}
    ${CaseType.AUTOPSY}
    ${CaseType.BODY_SEARCH}
    ${CaseType.INTERNET_USAGE}
    ${CaseType.OTHER}
  `.it('should mask $type cases', ({ type }) => {
    const theCase = createCase(type)

    const res = maskCase(theCase)

    expect(res).toStrictEqual({
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
    })
  })
})

describe('Mask Case by User', () => {
  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
  `.describe('given a $type case', ({ type }) => {
    each`
      user
      ${{ role: UserRole.PROSECUTOR }}
      ${{ role: UserRole.JUDGE }}
      ${{ role: UserRole.REGISTRAR }}
    `.it('should not mask the case for $user', ({ user }) => {
      const theCase = createCase(type)

      const res = maskCaseByUser(theCase, user)

      expect(res).toBe(theCase)
    })
  })

  each`
    type
    ${CaseType.SEARCH_WARRANT}
    ${CaseType.BANKING_SECRECY_WAIVER}
    ${CaseType.PHONE_TAPPING}
    ${CaseType.TELECOMMUNICATIONS}
    ${CaseType.TRACKING_EQUIPMENT}
    ${CaseType.PSYCHIATRIC_EXAMINATION}
    ${CaseType.SOUND_RECORDING_EQUIPMENT}
    ${CaseType.AUTOPSY}
    ${CaseType.BODY_SEARCH}
    ${CaseType.INTERNET_USAGE}
    ${CaseType.OTHER}
  `.describe('given a $type case', ({ type }) => {
    each`
      user
      ${{ role: UserRole.PROSECUTOR }}
      ${{ id: '-', role: UserRole.JUDGE }}
      ${{ id: '-', role: UserRole.REGISTRAR }}
    `.it('should not mask the case for $user', ({ user }) => {
      const theCase = createCase(type)

      const res = maskCaseByUser(theCase, user)

      expect(res).toBe(theCase)
    })

    each`
      user
      ${{ role: UserRole.JUDGE }}
      ${{ role: UserRole.REGISTRAR }}
    `.it('should mask the case for $user', ({ user }) => {
      const theCase = createCase(type)

      const res = maskCaseByUser(theCase, user)

      expect(res).toStrictEqual({
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
      })
    })
  })
})
