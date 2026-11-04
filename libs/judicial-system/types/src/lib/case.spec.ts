import each from 'jest-each'

import {
  CasePoliceState,
  CaseState,
  CaseType,
  getIndictmentCasePoliceState,
  hasIndictmentCaseBeenSubmittedToCourt,
  isInvestigationCase,
  isRestrictionCase,
} from './case'

describe('Case Type', () => {
  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
    ${CaseType.ADMISSION_TO_FACILITY}
  `.it('should categorize $type as a restriction case', ({ type }) => {
    expect(isRestrictionCase(type)).toBe(true)
    expect(isInvestigationCase(type)).toBe(false)
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
    ${CaseType.RESTRAINING_ORDER}
    ${CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME}
    ${CaseType.EXPULSION_FROM_HOME}
    ${CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION}
    ${CaseType.VIDEO_RECORDING_EQUIPMENT}
    ${CaseType.OTHER}
  `.it('should categorize $type as an investigation case', ({ type }) => {
    expect(isRestrictionCase(type)).toBe(false)
    expect(isInvestigationCase(type)).toBe(true)
  })
})

describe('hasIndictmentCaseBeenSubmittedToCourt', () => {
  each`
    state
    ${CaseState.SUBMITTED}
    ${CaseState.RECEIVED}
    ${CaseState.COMPLETED}
    ${CaseState.CORRECTING}
  `.it('should return true for $state', ({ state }) => {
    expect(hasIndictmentCaseBeenSubmittedToCourt(state)).toBe(true)
  })

  each`
    state
    ${CaseState.DRAFT}
    ${CaseState.WAITING_FOR_REVIEW}
    ${CaseState.WAITING_FOR_CONFIRMATION}
    ${CaseState.WAITING_FOR_CANCELLATION}
    ${CaseState.DELETED}
    ${undefined}
    ${null}
  `.it('should return false for $state', ({ state }) => {
    expect(hasIndictmentCaseBeenSubmittedToCourt(state)).toBe(false)
  })
})

describe('getIndictmentCasePoliceState', () => {
  each`
    state                                    | policeState
    ${CaseState.DRAFT}                       | ${CasePoliceState.DRAFT}
    ${CaseState.WAITING_FOR_REVIEW}          | ${CasePoliceState.DRAFT}
    ${CaseState.WAITING_FOR_CONFIRMATION}    | ${CasePoliceState.DRAFT}
    ${CaseState.SUBMITTED}                   | ${CasePoliceState.SUBMITTED}
    ${CaseState.RECEIVED}                    | ${CasePoliceState.SUBMITTED}
    ${CaseState.WAITING_FOR_CANCELLATION}    | ${CasePoliceState.SUBMITTED}
    ${CaseState.COMPLETED}                   | ${CasePoliceState.SUBMITTED}
    ${CaseState.CORRECTING}                  | ${CasePoliceState.SUBMITTED}
  `.it('should map $state to $policeState', ({ state, policeState }) => {
    expect(getIndictmentCasePoliceState(state)).toBe(policeState)
  })
})
