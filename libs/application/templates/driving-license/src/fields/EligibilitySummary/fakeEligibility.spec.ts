import { RequirementKey } from '@island.is/api/schema'
import { fakeEligibility } from './fakeEligibility'
import { B_FULL, B_FULL_RENEWAL_65, B_TEMP, BE } from '../../lib/constants'

describe('fakeEligibility', () => {
  describe('usesPhotoGate truth table', () => {
    it('applies photo gate for BE regardless of redesign flags', () => {
      const result = fakeEligibility(BE, 365, false, false, false)
      expect(result.isEligible).toBe(false)
      expect(
        result.requirements?.some(
          (r) =>
            r.key === RequirementKey.hasNoPhoto && r.requirementMet === false,
        ),
      ).toBe(true)
    })

    it('applies photo gate for B-full-renewal-65 only when is65RenewalRedesignEnabled is true', () => {
      const flagOn = fakeEligibility(B_FULL_RENEWAL_65, 365, false, true, false)
      expect(flagOn.isEligible).toBe(false)
      expect(
        flagOn.requirements?.some((r) => r.key === RequirementKey.hasNoPhoto),
      ).toBe(true)

      const flagOff = fakeEligibility(
        B_FULL_RENEWAL_65,
        365,
        false,
        false,
        false,
      )
      expect(flagOff.isEligible).toBe(true)
      expect(
        flagOff.requirements?.some((r) => r.key === RequirementKey.hasNoPhoto),
      ).toBe(false)
    })

    it('applies photo gate for B-temp only when isBTempRedesignEnabled is true', () => {
      const flagOn = fakeEligibility(B_TEMP, 365, false, false, true)
      expect(flagOn.isEligible).toBe(false)
      expect(
        flagOn.requirements?.some((r) => r.key === RequirementKey.hasNoPhoto),
      ).toBe(true)

      const flagOff = fakeEligibility(B_TEMP, 365, false, false, false)
      expect(flagOff.isEligible).toBe(true)
      expect(
        flagOff.requirements?.some((r) => r.key === RequirementKey.hasNoPhoto),
      ).toBe(false)
    })

    it('never applies photo gate for B-full', () => {
      const result = fakeEligibility(B_FULL, 365, false, true, true)
      expect(result.isEligible).toBe(true)
      expect(
        result.requirements?.some((r) => r.key === RequirementKey.hasNoPhoto),
      ).toBe(false)
    })
  })

  describe('hasPhoto outcome under the photo gate', () => {
    it('reports eligible when photo is present (BE)', () => {
      const result = fakeEligibility(BE, 365, true, false, false)
      expect(result.isEligible).toBe(true)
      expect(
        result.requirements?.find((r) => r.key === RequirementKey.hasNoPhoto)
          ?.requirementMet,
      ).toBe(true)
    })

    it('reports eligible when photo is present (redesigned 65+)', () => {
      const result = fakeEligibility(B_FULL_RENEWAL_65, 365, true, true, false)
      expect(result.isEligible).toBe(true)
    })

    it('reports eligible when photo is present (redesigned B-temp)', () => {
      const result = fakeEligibility(B_TEMP, 365, true, false, true)
      expect(result.isEligible).toBe(true)
    })
  })

  describe('localResidency requirement', () => {
    it('fails residency when days < 185', () => {
      const result = fakeEligibility(BE, 100, true, false, false)
      const residency = result.requirements?.find(
        (r) => r.key === RequirementKey.localResidency,
      )
      expect(residency?.requirementMet).toBe(false)
    })

    it('passes residency when days >= 185', () => {
      const result = fakeEligibility(BE, 200, true, false, false)
      const residency = result.requirements?.find(
        (r) => r.key === RequirementKey.localResidency,
      )
      expect(residency?.requirementMet).toBe(true)
    })
  })
})
