import { Auth } from '@island.is/auth-nest-tools'
import { ApplicationApi, PaymentApi, TaxApi } from '../../gen/fetch'
import { HmsHousingBenefitsClientService } from './hms-housing-benefits.service'

const auth = { authorization: 'Bearer test', nationalId: '0101303019' } as Auth

const createService = (taxResponse: unknown) => {
  const hasTaxReturnForYear = jest.fn().mockResolvedValue(taxResponse)
  const hasTaxReturnLastFiveYears = jest.fn().mockResolvedValue(taxResponse)
  const taxApi = {
    withMiddleware: () => ({ hasTaxReturnForYear, hasTaxReturnLastFiveYears }),
  } as unknown as TaxApi

  const service = new HmsHousingBenefitsClientService(
    {} as PaymentApi,
    {} as ApplicationApi,
    taxApi,
  )

  return { service, hasTaxReturnForYear, hasTaxReturnLastFiveYears }
}

describe('HmsHousingBenefitsClientService tax endpoints', () => {
  // The generated client deserializes these bare-boolean bodies with TextApiResponse,
  // so the values arriving here are strings despite the `boolean` type.
  describe('hasTaxReturnForYear', () => {
    it.each([
      ['false', false],
      ['False', false],
      ['FALSE', false],
      [' false ', false],
      ['', false],
      ['true', true],
      ['True', true],
      [' true ', true],
    ])('coerces the string %p to %p', async (response, expected) => {
      const { service } = createService(response)

      await expect(
        service.hasTaxReturnForYear(auth, '0101303019', 2024),
      ).resolves.toBe(expected)
    })

    it.each([
      [false, false],
      [true, true],
    ])(
      'passes the real boolean %p through as %p',
      async (response, expected) => {
        const { service } = createService(response)

        await expect(
          service.hasTaxReturnForYear(auth, '0101303019', 2024),
        ).resolves.toBe(expected)
      },
    )

    it('requests the given year', async () => {
      const { service, hasTaxReturnForYear } = createService('true')

      await service.hasTaxReturnForYear(auth, '0101303019', 2023)

      expect(hasTaxReturnForYear).toHaveBeenCalledWith({
        version: '1',
        year: 2023,
      })
    })
  })

  describe('hasTaxReturnLastFiveYears', () => {
    it.each([
      ['false', false],
      ['true', true],
      [false, false],
      [true, true],
    ])('coerces %p to %p', async (response, expected) => {
      const { service } = createService(response)

      await expect(
        service.hasTaxReturnLastFiveYears(auth, '0101303019'),
      ).resolves.toBe(expected)
    })
  })
})
