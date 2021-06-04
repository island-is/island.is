import set from 'lodash/set'

import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import { FamilyMember } from '@island.is/api/domains/national-registry'

import {
  getOtherParentId,
  getPersonalAllowance,
  getEmployer,
  getPensionFund,
  getPrivatePensionFundRatio,
} from './parental-leave.utils'

import { apiConstants, formConstants } from './constants'

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

let application: Application
beforeEach(() => {
  application = createApplicationBase()
})

describe('getOtherParentId', () => {
  it('should return null if no parent is selected', () => {
    application.answers.otherParent = formConstants.spouseSelection.noSpouse

    const expectedId = null

    expect(getOtherParentId(application)).toBe(expectedId)
  })

  it('should return answers.otherParentId if manual is selected', () => {
    application.answers.otherParent = formConstants.spouseSelection.manual

    const expectedId = '1234567899'

    application.answers.otherParentId = expectedId

    expect(getOtherParentId(application)).toBe(expectedId)
  })

  it('should return spouse if spouse is selected', () => {
    const expectedSpouse: Pick<
      FamilyMember,
      'fullName' | 'familyRelation' | 'nationalId'
    > = {
      familyRelation: 'spouse' as FamilyMember['familyRelation'],
      fullName: 'Spouse Spouseson',
      nationalId: '1234567890',
    }

    application.externalData.family = {
      data: [expectedSpouse],
      date: new Date(),
      status: 'success',
    }
    application.answers.otherParent = 'spouse'

    expect(getOtherParentId(application)).toBe(expectedSpouse.nationalId)
  })
})

describe('getPersonalAllowance', () => {
  describe('for self', () => {
    it('should return 0 if not going to use it', () => {
      application.answers.usePersonalAllowance = formConstants.boolean.false

      expect(getPersonalAllowance(application)).toBe(0)
    })

    it('should return 100 if using as much as possible', () => {
      application.answers.usePersonalAllowance = formConstants.boolean.true
      set(
        application.answers,
        'personalAllowance.useAsMuchAsPossible',
        formConstants.boolean.true,
      )

      expect(getPersonalAllowance(application)).toBe(100)
    })

    it('should return expected value if using a custom percentage', () => {
      const customValues = [0, 1, 15, 50, 90, 99, 100]

      application.answers.usePersonalAllowance = formConstants.boolean.true

      set(
        application.answers,
        'personalAllowance.useAsMuchAsPossible',
        formConstants.boolean.false,
      )

      for (const value of customValues) {
        set(application.answers, 'personalAllowance.usage', value)
        expect(getPersonalAllowance(application)).toBe(value)
      }
    })
  })

  describe('for spouse', () => {
    it('should return 0 if not going to use it', () => {
      application.answers.usePersonalAllowanceFromSpouse =
        formConstants.boolean.false

      expect(getPersonalAllowance(application, true)).toBe(0)
    })

    it('should return 100 if using as much as possible', () => {
      application.answers.usePersonalAllowanceFromSpouse =
        formConstants.boolean.true
      set(
        application.answers,
        'personalAllowanceFromSpouse.useAsMuchAsPossible',
        formConstants.boolean.true,
      )

      expect(getPersonalAllowance(application, true)).toBe(100)
    })

    it('should return expected value if using a custom percentage', () => {
      const customValues = [0, 1, 15, 50, 90, 99, 100]

      application.answers.usePersonalAllowanceFromSpouse =
        formConstants.boolean.true

      set(
        application.answers,
        'personalAllowanceFromSpouse.useAsMuchAsPossible',
        formConstants.boolean.false,
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
      'employer.nationalRegistryId',
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

// TODO: periods and validate against existing payment plans
