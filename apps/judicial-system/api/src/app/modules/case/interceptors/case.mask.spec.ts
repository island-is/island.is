import each from 'jest-each'

import {
  CaseAppealDecision,
  CaseDecision,
  CaseGender,
  CaseState,
  CaseType,
  InstitutionType,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { Case } from '../models'
import { maskCase, maskCaseByUser } from './case.mask'

function createCase(type: CaseType): Case {
  const baseCase: Case = {
    id: '-',
    created: '-',
    modified: '-',
    type,
    description: '-',
    state: CaseState.SUBMITTED,
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
    legalProvisions: [],
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
    accusedBookings: '-',
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

function maskedCase(theCase: Case) {
  return {
    id: theCase.id,
    created: theCase.created,
    modified: theCase.modified,
    type: theCase.type,
    state: theCase.state,
    policeCaseNumber: theCase.policeCaseNumber,
    accusedNationalId: '0000000000',
    accusedName: 'T',
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

    expect(res).toStrictEqual(maskedCase(theCase))
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
      ${{ id: '+', role: UserRole.PROSECUTOR }}
      ${{ id: '+', role: UserRole.JUDGE }}
      ${{ id: '+', role: UserRole.REGISTRAR }}
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
      ${{ id: '+', role: UserRole.PROSECUTOR }}
      ${{ id: '-', role: UserRole.JUDGE }}
      ${{ id: '-', role: UserRole.REGISTRAR }}
    `.it('should not mask the case for $user', ({ user }) => {
      const theCase = createCase(type)

      const res = maskCaseByUser(theCase, user)

      expect(res).toBe(theCase)
    })

    each`
      user
      ${{ id: '+', role: UserRole.JUDGE }}
      ${{ id: '+', role: UserRole.REGISTRAR }}
    `.it('should mask the case for $user', ({ user }) => {
      const theCase = createCase(type)

      const res = maskCaseByUser(theCase, user)

      expect(res).toStrictEqual(maskedCase(theCase))
    })

    it('should mask cases without a judge for judges', () => {
      const theCase = { ...createCase(type), judge: undefined }
      const judge = { id: '+', role: UserRole.JUDGE } as User

      const res = maskCaseByUser(theCase, judge)

      expect(res).toStrictEqual(maskedCase(theCase))
    })

    it('should mask cases without a registrar for registrars', () => {
      const theCase = { ...createCase(type), registrar: undefined }
      const registrar = { id: '+', role: UserRole.REGISTRAR } as User

      const res = maskCaseByUser(theCase, registrar)

      expect(res).toStrictEqual(maskedCase(theCase))
    })
  })
})

describe('Full name', () => {
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
  `.it('should mask the name', ({ type }) => {
    const res = maskCase({ type, accusedName: 'Jón Jónsson' } as Case)

    expect(res.accusedName).toBe('LU')
  })
})
