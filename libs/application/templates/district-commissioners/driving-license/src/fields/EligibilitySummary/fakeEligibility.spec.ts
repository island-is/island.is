import { RequirementKey } from '@island.is/api/schema'
import { fakeEligibility } from './fakeEligibility'
import { B_TEMP } from '../../utils/constants'

describe('fakeEligibility — photo gate', () => {
  it('blocks eligibility and reports an unmet photo requirement when no photo exists', () => {
    const result = fakeEligibility(B_TEMP, 365, false)

    expect(result.isEligible).toBe(false)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.hasNoPhoto,
      requirementMet: false,
    })
  })

  it('allows eligibility and reports a met photo requirement when a photo exists', () => {
    const result = fakeEligibility(B_TEMP, 365, true)

    expect(result.isEligible).toBe(true)
    expect(result.requirements).toContainEqual({
      key: RequirementKey.hasNoPhoto,
      requirementMet: true,
    })
  })
})
