import set from 'lodash/set'

import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import {
  getSelectedChild,
  NO,
  ParentalRelations,
  YES,
} from '@island.is/application/templates/parental-leave'

import {
  getPersonalAllowance,
  getEmployer,
  getPensionFund,
  getPrivatePensionFundRatio,
  getRightsCode,
} from './parental-leave.utils'
import { apiConstants } from './constants'

let id = 0
const createApplicationBase = (): Application => ({
  answers: {},
  applicant: '',
  assignees: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  externalData: {},
  id: (id++).toString(),
  state: '',
  typeId: ApplicationTypes.PARENTAL_LEAVE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
})

const createExternalDataChild = (
  isPrimaryParent: boolean,
  expectedDateOfBirth: string,
  otherParentNationalRegistryId = '1111111119',
): ReturnType<typeof getSelectedChild> => {
  const childBase = {
    expectedDateOfBirth,
    hasRights: true,
    remainingDays: 180,
    transferredDays: 0,
  }

  if (isPrimaryParent) {
    return {
      ...childBase,
      parentalRelation: ParentalRelations.primary,
    }
  } else {
    return {
      ...childBase,
      parentalRelation: ParentalRelations.secondary,
      primaryParentNationalRegistryId: otherParentNationalRegistryId,
    }
  }
}

let application: Application
beforeEach(() => {
  application = createApplicationBase()
})

describe('getPersonalAllowance', () => {
  describe('for self', () => {
    it('should return 0 if not going to use it', () => {
      application.answers.usePersonalAllowance = NO

      expect(getPersonalAllowance(application)).toBe(0)
    })

    it('should return 100 if using as much as possible', () => {
      application.answers.usePersonalAllowance = YES
      set(application.answers, 'personalAllowance.useAsMuchAsPossible', YES)

      expect(getPersonalAllowance(application)).toBe(100)
    })

    it('should return expected value if using a custom percentage', () => {
      const customValues = [0, 1, 15, 50, 90, 99, 100]

      application.answers.usePersonalAllowance = YES

      set(application.answers, 'personalAllowance.useAsMuchAsPossible', NO)

      for (const value of customValues) {
        set(application.answers, 'personalAllowance.usage', value)
        expect(getPersonalAllowance(application)).toBe(value)
      }
    })
  })

  describe('for spouse', () => {
    it('should return 0 if not going to use it', () => {
      application.answers.usePersonalAllowanceFromSpouse = NO

      expect(getPersonalAllowance(application, true)).toBe(0)
    })

    it('should return 100 if using as much as possible', () => {
      application.answers.usePersonalAllowanceFromSpouse = YES
      set(
        application.answers,
        'personalAllowanceFromSpouse.useAsMuchAsPossible',
        YES,
      )

      expect(getPersonalAllowance(application, true)).toBe(100)
    })

    it('should return expected value if using a custom percentage', () => {
      const customValues = [0, 1, 15, 50, 90, 99, 100]

      application.answers.usePersonalAllowanceFromSpouse = YES

      set(
        application.answers,
        'personalAllowanceFromSpouse.useAsMuchAsPossible',
        NO,
      )

      for (const value of customValues) {
        set(application.answers, 'personalAllowanceFromSpouse.usage', value)
        expect(getPersonalAllowance(application, true)).toBe(value)
      }
    })
  })
})

describe('getEmployer', () => {
  it('should return applicant if self employed', () => {
    const expectedEmail = 'applicant@test.test'
    const expectedNationalRegistryId = '1234567899'

    set(application.answers, 'applicant.email', expectedEmail)
    set(application, 'applicant', expectedNationalRegistryId)

    expect(getEmployer(application, true)).toEqual({
      email: expectedEmail,
      nationalRegistryId: expectedNationalRegistryId,
    })
  })

  it('should return employer if applicant is employee', () => {
    const expectedEmail = 'employer@test.test'
    const expectedNationalRegistryId = '1234567889'

    set(application.answers, 'employer.email', expectedEmail)
    set(
      application.answers,
      'employerNationalRegistryId',
      expectedNationalRegistryId,
    )

    expect(getEmployer(application)).toEqual({
      email: expectedEmail,
      nationalRegistryId: expectedNationalRegistryId,
    })
  })
})

describe('getPensionFund', () => {
  it('should return required pension fund', () => {
    const expectedId = '123'

    set(application.answers, 'payments.pensionFund', expectedId)

    expect(getPensionFund(application)).toEqual({
      id: expectedId,
      name: '',
    })
  })

  it('should throw an error if required pension fund is not provided', () => {
    expect(() => {
      getPensionFund(application)
    }).toThrowError()
  })

  it('should return default empty id for no selected private pension fund', () => {
    const expectedId = apiConstants.pensionFunds.noPrivatePensionFundId

    expect(getPensionFund(application, true)).toEqual({
      id: expectedId,
      name: '',
    })
  })

  it('should return selected private pension fund if selected', () => {
    const expectedId = 'asdf'

    set(application.answers, 'payments.privatePensionFund', expectedId)

    expect(getPensionFund(application, true)).toEqual({
      id: expectedId,
      name: '',
    })
  })
})

describe('getPrivatePensionFundRatio', () => {
  it('should return 0 when no pension fund is selected', () => {
    expect(getPrivatePensionFundRatio(application)).toBe(0)
  })

  it('should return value when it is selected', () => {
    const expectedValue = 5
    set(
      application.answers,
      'payments.privatePensionFundPercentage',
      expectedValue.toString(),
    )

    expect(getPrivatePensionFundRatio(application)).toBe(expectedValue)
  })
})

describe('getRightsCode', () => {
  it('should return M-L-GR for a primary parent with employer', () => {
    const base = createApplicationBase()
    set(base, 'externalData.children.data.children', [
      createExternalDataChild(true, '2022-03-01'),
    ])
    set(base, 'answers.selectedChild', '0')
    set(base, 'answers.employer.isSelfEmployed', 'no')

    const expected = 'M-L-GR'
    const result = getRightsCode(base)

    expect(result).toBe(expected)
  })
  it('should return M-S-GR for a self employed primary parent', () => {
    const base = createApplicationBase()
    set(base, 'externalData.children.data.children', [
      createExternalDataChild(true, '2022-03-01'),
    ])
    set(base, 'answers.selectedChild', '0')
    set(base, 'answers.employer.isSelfEmployed', 'yes')

    const expected = 'M-S-GR'
    const result = getRightsCode(base)

    expect(result).toBe(expected)
  })
  // TODO:
  // it('should return M-S-GR-SJ for a primary parent both self employed and with an employer', () => {})

  // These apply to unborn children where parents are in registered cohabitation
  it('should return FO-L-GR for a secondary parent with employer and custody', () => {
    const primaryParentNationalRegistryId = '1111111119'

    const base = createApplicationBase()
    set(base, 'externalData.children.data.children', [
      createExternalDataChild(
        false,
        '2022-03-01',
        primaryParentNationalRegistryId,
      ),
    ])
    set(base, 'externalData.family.data', [
      {
        fullName: 'Spouse Spousson',
        nationalId: primaryParentNationalRegistryId,
        familyRelation: 'spouse',
      },
    ])
    set(base, 'answers.selectedChild', '0')
    set(base, 'answers.employer.isSelfEmployed', 'no')

    const expected = 'FO-L-GR'
    const result = getRightsCode(base)

    expect(result).toBe(expected)
  })
  it('should return FO-S-GR for a self employed secondary parent with custody', () => {
    const primaryParentNationalRegistryId = '1111111119'

    const base = createApplicationBase()
    set(base, 'externalData.children.data.children', [
      createExternalDataChild(false, '2022-03-01'),
    ])
    set(base, 'externalData.family.data', [
      {
        fullName: 'Spouse Spousson',
        nationalId: primaryParentNationalRegistryId,
        familyRelation: 'spouse',
      },
    ])
    set(base, 'answers.selectedChild', '0')
    set(base, 'answers.employer.isSelfEmployed', 'yes')

    const expected = 'FO-S-GR'
    const result = getRightsCode(base)

    expect(result).toBe(expected)
  })
  // TODO:
  // it('should return FO-L-GR-SJ for secondary parent that is both self employed and employed with custody', () => {})

  // These codes apply to unborn children where parents are not registered partners
  it('should return FO-FL-L-GR for a secondary parent with employer and no custody', () => {
    const base = createApplicationBase()
    set(base, 'externalData.children.data.children', [
      createExternalDataChild(false, '2022-03-01'),
    ])
    set(base, 'answers.selectedChild', '0')
    set(base, 'answers.employer.isSelfEmployed', 'no')

    const expected = 'FO-FL-L-GR'
    const result = getRightsCode(base)

    expect(result).toBe(expected)
  })
  it('should return FO-FL-S-GR for a self employed secondary parent with no custody', () => {
    const base = createApplicationBase()
    set(base, 'externalData.children.data.children', [
      createExternalDataChild(false, '2022-03-01'),
    ])
    set(base, 'answers.selectedChild', '0')
    set(base, 'answers.employer.isSelfEmployed', 'yes')

    const expected = 'FO-FL-S-GR'
    const result = getRightsCode(base)

    expect(result).toBe(expected)
  })
  // TODO:
  // it('should return FO-FL-L-GR-SJ for secondary parent that is both self employed and employed with custody', () => {})
})
