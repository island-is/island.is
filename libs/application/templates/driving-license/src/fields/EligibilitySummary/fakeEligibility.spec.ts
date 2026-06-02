import { RequirementKey } from '@island.is/api/schema'
import { fakeEligibility } from './fakeEligibility'
import { B_TEMP } from '../../lib/constants'

describe('fakeEligibility — B-temp redesign photo gate', () => {
  it('blocks eligibility and reports an unmet photo requirement when the flag is on and no photo exists', () => {
    const result = fakeEligibility(B_TEMP, 365, false, false, true)

    expect(result.isEligible).toBe(false)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.hasNoPhoto,
      requirementMet: false,
    })
  })

  it('allows eligibility and reports a met photo requirement when the flag is on and a photo exists', () => {
    const result = fakeEligibility(B_TEMP, 365, true, false, true)

    expect(result.isEligible).toBe(true)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.hasNoPhoto,
      requirementMet: true,
    })
  })

  it('does not gate on a photo when the B-temp redesign flag is off', () => {
    const result = fakeEligibility(B_TEMP, 365, false, false, false)

    expect(result.isEligible).toBe(true)
    expect(
      result.requirements.some((r) => r.key === RequirementKey.hasNoPhoto),
    ).toBe(false)
  })
})
