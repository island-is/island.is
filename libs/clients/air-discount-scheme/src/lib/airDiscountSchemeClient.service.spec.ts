import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'

import { Discount, Flight, User, UsersApi } from '../../gen/fetch'
import { AirDiscountSchemeClientService } from './airDiscountSchemeClient.service'

const auth = { nationalId: '0101302989' } as AuthUser

const buildFetchError = (status: number) => FetchError.buildMock({ status })

describe('AirDiscountSchemeClientService', () => {
  let usersApi: jest.Mocked<
    Pick<
      UsersApi,
      | 'withMiddleware'
      | 'privateDiscountControllerGetCurrentDiscountByNationalId'
      | 'privateDiscountControllerCreateDiscountCode'
      | 'privateUserControllerGetUserRelations'
      | 'privateFlightUserControllerGetUserAndRelationsFlights'
    >
  >
  let service: AirDiscountSchemeClientService

  beforeEach(() => {
    usersApi = {
      withMiddleware: jest.fn(),
      privateDiscountControllerGetCurrentDiscountByNationalId: jest.fn(),
      privateDiscountControllerCreateDiscountCode: jest.fn(),
      privateUserControllerGetUserRelations: jest.fn(),
      privateFlightUserControllerGetUserAndRelationsFlights: jest.fn(),
    }
    usersApi.withMiddleware.mockReturnValue((usersApi as unknown) as UsersApi)
    service = new AirDiscountSchemeClientService(
      (usersApi as unknown) as UsersApi,
    )
  })

  describe('getCurrentDiscount', () => {
    it('returns the discount', async () => {
      const discount = { discountCode: 'ABC123' } as Discount
      usersApi.privateDiscountControllerGetCurrentDiscountByNationalId.mockResolvedValue(
        discount,
      )

      await expect(
        service.getCurrentDiscount(auth, auth.nationalId),
      ).resolves.toBe(discount)
    })

    it('returns null on an empty body', async () => {
      usersApi.privateDiscountControllerGetCurrentDiscountByNationalId.mockRejectedValue(
        new Error('invalid json response body at http://localhost reason: …'),
      )

      await expect(
        service.getCurrentDiscount(auth, auth.nationalId),
      ).resolves.toBeNull()
    })

    it.each([403, 404])('returns null on %i', async (status) => {
      usersApi.privateDiscountControllerGetCurrentDiscountByNationalId.mockRejectedValue(
        await buildFetchError(status),
      )

      await expect(
        service.getCurrentDiscount(auth, auth.nationalId),
      ).resolves.toBeNull()
    })

    it('rethrows other errors', async () => {
      const error = await buildFetchError(500)
      usersApi.privateDiscountControllerGetCurrentDiscountByNationalId.mockRejectedValue(
        error,
      )

      await expect(
        service.getCurrentDiscount(auth, auth.nationalId),
      ).rejects.toBe(error)
    })
  })

  describe('createDiscount', () => {
    it.each([403, 404])('returns null on %i', async (status) => {
      usersApi.privateDiscountControllerCreateDiscountCode.mockRejectedValue(
        await buildFetchError(status),
      )

      await expect(
        service.createDiscount(auth, auth.nationalId),
      ).resolves.toBeNull()
    })

    it('does not treat an empty body as a missing discount', async () => {
      const error = new Error('invalid json response body')
      usersApi.privateDiscountControllerCreateDiscountCode.mockRejectedValue(
        error,
      )

      await expect(service.createDiscount(auth, auth.nationalId)).rejects.toBe(
        error,
      )
    })
  })

  describe('getUserRelations', () => {
    it('calls the API with the authenticated national id', async () => {
      const relations = [{ nationalId: auth.nationalId }] as User[]
      usersApi.privateUserControllerGetUserRelations.mockResolvedValue(
        relations,
      )

      await expect(service.getUserRelations(auth)).resolves.toBe(relations)
      expect(
        usersApi.privateUserControllerGetUserRelations,
      ).toHaveBeenCalledWith({ nationalId: auth.nationalId })
    })

    it.each([403, 404])('returns [] on %i', async (status) => {
      usersApi.privateUserControllerGetUserRelations.mockRejectedValue(
        await buildFetchError(status),
      )

      await expect(service.getUserRelations(auth)).resolves.toEqual([])
    })

    it('rethrows other errors', async () => {
      const error = await buildFetchError(500)
      usersApi.privateUserControllerGetUserRelations.mockRejectedValue(error)

      await expect(service.getUserRelations(auth)).rejects.toBe(error)
    })
  })

  describe('getUserAndRelationsFlights', () => {
    it('returns the flights', async () => {
      const flights = [{ id: '1' }] as Flight[]
      usersApi.privateFlightUserControllerGetUserAndRelationsFlights.mockResolvedValue(
        flights,
      )

      await expect(service.getUserAndRelationsFlights(auth)).resolves.toBe(
        flights,
      )
    })

    it.each([403, 404])('returns [] on %i', async (status) => {
      usersApi.privateFlightUserControllerGetUserAndRelationsFlights.mockRejectedValue(
        await buildFetchError(status),
      )

      await expect(service.getUserAndRelationsFlights(auth)).resolves.toEqual(
        [],
      )
    })

    it('rethrows other errors', async () => {
      const error = await buildFetchError(500)
      usersApi.privateFlightUserControllerGetUserAndRelationsFlights.mockRejectedValue(
        error,
      )

      await expect(service.getUserAndRelationsFlights(auth)).rejects.toBe(error)
    })
  })
})
