import { createApplication } from '@island.is/application/testing'
import {
  isVisible,
  isApplicationForCondition,
  needsHealthCertificateCondition,
  allowFakeCondition,
  hasCompletedPrerequisitesStep,
} from './formUtils'
import { NO, YES } from '@island.is/application/core'

describe('isVisible', () => {
  it('returns true when all functions return true', () => {
    expect(
      isVisible(
        () => true,
        () => true,
      )({}),
    ).toBe(true)
  })
})

describe('isApplicationForCondition', () => {
  describe('expecting B-full', () => {
    it('returns true when it is not defined', () => {
      expect(isApplicationForCondition('B-full')({}))
    })

    it('returns true when B-full is selected', () => {
      expect(
        isApplicationForCondition('B-full')({ applicationFor: 'B-full' }),
      ).toBe(true)
    })

    it('returns false when B-temp is selected', () => {
      expect(
        isApplicationForCondition('B-full')({ applicationFor: 'B-temp' }),
      ).toBe(false)
    })
  })
})

describe('needsHealthCertificateCondition', () => {
  it('returns true when one ore more values in the list is marked yes', () => {
    expect(
      needsHealthCertificateCondition(YES)(
        {
          healthDeclaration: {
            usesContactGlasses: YES,
            isAlcoholic: NO,
          },
        },
        { glassesCheck: { data: false, status: 'success', date: new Date() } },
      ),
    ).toBe(true)
    expect(
      needsHealthCertificateCondition(YES)(
        {
          healthDeclaration: {
            usesContactGlasses: YES,
            isAlcoholic: YES,
          },
        },

        { glassesCheck: { data: true, status: 'success', date: new Date() } },
      ),
    ).toBe(true)
  })

  it('returns false when none of them are marked yes', () => {
    expect(
      needsHealthCertificateCondition(YES)(
        {
          healthDeclaration: {
            usesContactGlasses: NO,
            isAlcoholic: NO,
          },
        },
        { glassesCheck: { data: false, status: 'success', date: new Date() } },
      ),
    ).toBe(false)
  })

  it('returns true when glasses mismatch', () => {
    expect(
      needsHealthCertificateCondition(YES)(
        {
          healthDeclaration: {
            usesContactGlasses: NO,
            isAlcoholic: NO,
          },
        },
        { glassesCheck: { data: true, status: 'success', date: new Date() } },
      ),
    ).toBe(true)
  })
})

describe('allowFakeCondition', () => {
  it('works', () => {
    expect(allowFakeCondition(YES)({ fakeData: { useFakeData: YES } })).toBe(
      true,
    )
    expect(allowFakeCondition(YES)({ fakeData: { useFakeData: NO } })).toBe(
      false,
    )
    expect(allowFakeCondition(YES)({ fakeData: {} })).toBe(false)
    expect(allowFakeCondition(YES)({})).toBe(false)
  })
})

describe('hasCompletedPrerequisitesStep', () => {
  it('returns true for an application where the prerequisites have been completed', () => {
    expect(
      hasCompletedPrerequisitesStep(true)({
        application: createApplication({
          answers: {
            requirementsMet: true,
          },
        }),
      }),
    ).toBe(true)
  })

  it('returns false for an empty application', () => {
    expect(
      hasCompletedPrerequisitesStep(true)({ application: createApplication() }),
    ).toBe(false)
  })
  it('returns false for an empty application', () => {
    expect(
      hasCompletedPrerequisitesStep(true)({
        application: createApplication({
          answers: {
            requirementsMet: false,
          },
        }),
      }),
    ).toBe(false)
  })
})
