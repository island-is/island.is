import each from 'jest-each'

import { CaseType, isInvestigationCase, isRestrictionCase } from './case'

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
