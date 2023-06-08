import { PersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'
import { User } from '@island.is/financial-aid/shared/lib'
import { DirectTaxPaymentsResponse } from '../models/directTaxPayments.response'
import { createTestingPersonalTaxReturnModule } from './createTestingPersonalTaxReturnModule'

interface Then {
  result: DirectTaxPaymentsResponse
  error: Error
}

type GivenWhenThen = (user: User) => Promise<Then>

describe('PersonalTaxReturnController - Municipalities direct tax payments', () => {
  let givenWhenThen: GivenWhenThen
  let mockPersonalTaxReturnApi: PersonalTaxReturnApi

  beforeEach(async () => {
    const { personalTaxReturnController, personalTaxReturnApi } =
      await createTestingPersonalTaxReturnModule()

    mockPersonalTaxReturnApi = personalTaxReturnApi

    givenWhenThen = async (user: User): Promise<Then> => {
      const then = {} as Then

      await personalTaxReturnController
        .municipalitiesDirectTaxPayments(user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('Personal Tax Return Api fails', () => {
    const user = { nationalId: '0' } as User
    let personalTaxReturnApi: jest.Mock
    let then: Then

    beforeEach(async () => {
      personalTaxReturnApi =
        mockPersonalTaxReturnApi.directTaxPayments as jest.Mock
      personalTaxReturnApi.mockRejectedValueOnce({})

      then = await givenWhenThen(user)
    })

    it('should call personal tax return api', () => {
      expect(personalTaxReturnApi).toBeCalled()
    })

    it('should call personal tax return api with correct period', () => {
      const today = new Date()

      const threeMonthsAgoPeriod = new Date()
      threeMonthsAgoPeriod.setMonth(today.getMonth() - 3)

      const lastMonthPeriod = new Date()
      lastMonthPeriod.setMonth(today.getMonth() - 1)

      expect(personalTaxReturnApi).toHaveBeenCalledWith(
        user.nationalId,
        {
          year: threeMonthsAgoPeriod.getFullYear(),
          month: threeMonthsAgoPeriod.getMonth() + 1,
        },
        {
          year: lastMonthPeriod.getFullYear(),
          month: lastMonthPeriod.getMonth() + 1,
        },
      )
    })

    it('should return empty array', () => {
      expect(then.result).toEqual({ directTaxPayments: [], success: false })
    })
  })

  describe('Personal Tax Return Api succeeds', () => {
    const user = { nationalId: '0' } as User
    let personalTaxReturn: jest.Mock
    let then: Then
    const today = new Date()

    const threeMonthsAgoPeriod = new Date()
    threeMonthsAgoPeriod.setMonth(today.getMonth() - 3)

    const lastMonthPeriod = new Date()
    lastMonthPeriod.setMonth(today.getMonth() - 1)

    const returnValue = {
      salaryBreakdown: [
        {
          salaryTotal: 1,
          payerNationalId: 2,
          personalAllowance: 3,
          salaryWithheldAtSource: 4,
          period: 5,
          year: 2022,
        },
        {
          salaryTotal: 7,
          payerNationalId: 8,
          personalAllowance: 9,
          salaryWithheldAtSource: 10,
          period: 11,
          year: 2022,
        },
      ],
    }

    const expected = {
      directTaxPayments: [
        {
          totalSalary: 1,
          payerNationalId: '2',
          personalAllowance: 3,
          withheldAtSource: 4,
          month: 5,
          year: 2022,
        },
        {
          totalSalary: 7,
          payerNationalId: '8',
          personalAllowance: 9,
          withheldAtSource: 10,
          month: 11,
          year: 2022,
        },
      ],
      success: undefined,
    }

    beforeEach(async () => {
      personalTaxReturn =
        mockPersonalTaxReturnApi.directTaxPayments as jest.Mock
      personalTaxReturn.mockResolvedValueOnce(returnValue)

      then = await givenWhenThen(user)
    })

    it('should call personal tax return api with correct params', () => {
      expect(personalTaxReturn).toHaveBeenCalledWith(
        user.nationalId,
        {
          year: threeMonthsAgoPeriod.getFullYear(),
          month: threeMonthsAgoPeriod.getMonth() + 1,
        },
        {
          year: lastMonthPeriod.getFullYear(),
          month: lastMonthPeriod.getMonth() + 1,
        },
      )
    })

    it('should return correct values', () => {
      expect(then.result).toEqual(expected)
    })
  })
})
