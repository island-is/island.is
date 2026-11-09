import { ExternalData } from '@island.is/application/types'
import { getEligibilityState } from './eligibility'
import { IS_REGULATED_EXTERNAL_DATA_ID } from './constants'

const success = (
  isSupervisedEntity: unknown,
  accessWindowOpen: unknown,
): ExternalData => ({
  [IS_REGULATED_EXTERNAL_DATA_ID]: {
    data: { isSupervisedEntity, accessWindowOpen },
    date: new Date(),
    status: 'success',
  },
})

// How the action runner stores a provider that threw: status 'failure' and an
// empty data object, so the flags are missing rather than false.
const failure = (): ExternalData => ({
  [IS_REGULATED_EXTERNAL_DATA_ID]: {
    data: {},
    date: new Date(),
    status: 'failure',
    statusCode: 500,
  },
})

describe('getEligibilityState', () => {
  it('should be eligible when the company is supervised and the window is open', () => {
    expect(getEligibilityState(success(true, true))).toBe('eligible')
  })

  it.each([
    ['not a supervised entity', false, true],
    ['access window closed', true, false],
    ['neither supervised nor open', false, false],
  ])(
    'should be notEligible when Fjarskiptastofa answered and the company is %s',
    (_label, isSupervisedEntity, accessWindowOpen) => {
      expect(
        getEligibilityState(success(isSupervisedEntity, accessWindowOpen)),
      ).toBe('notEligible')
    },
  )

  // The whole point of the distinction: an X-Road outage or a timeout must not
  // be reported to an eligible company as "you are not allowed to apply".
  it('should be lookupFailed, not notEligible, when the lookup failed', () => {
    expect(getEligibilityState(failure())).toBe('lookupFailed')
  })

  it('should be lookupFailed when the provider has not run at all', () => {
    expect(getEligibilityState({})).toBe('lookupFailed')
  })

  it.each([
    ['both flags missing', undefined, undefined],
    ['one flag missing', true, undefined],
    ['a flag is not a boolean', true, 'yes'],
  ])(
    'should be lookupFailed when a successful response did not answer both flags (%s)',
    (_label, isSupervisedEntity, accessWindowOpen) => {
      expect(
        getEligibilityState(success(isSupervisedEntity, accessWindowOpen)),
      ).toBe('lookupFailed')
    },
  )
})
