import each from 'jest-each'

import { CaseType } from '@island.is/judicial-system/types'

import { Case } from '../models'
import { maskCase } from './case.mask'

describe('Cases Mask', () => {
  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
  `.it(
    'should not mask national id and name in restriction cases',
    ({ type }) => {
      const theCase = {
        type,
        accusedNationalId: '1234567890',
        accusedName: 'John Doe',
      } as Case

      const res = maskCase(theCase)

      expect(res.accusedNationalId).toBe('1234567890')
      expect(res.accusedName).toBe('John Doe')
    },
  )

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
  `.it(
    'should mask national id and name in investigation cases',
    ({ type }) => {
      const theCase = {
        type,
        accusedNationalId: '1234567890',
        accusedName: 'John Doe',
      } as Case

      const res = maskCase(theCase)

      expect(res.accusedNationalId).toBe('0000000000')
      expect(res.accusedName).toBe('X')
    },
  )
})
