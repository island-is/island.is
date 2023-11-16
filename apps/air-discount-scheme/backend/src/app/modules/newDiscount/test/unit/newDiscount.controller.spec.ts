import { Test } from '@nestjs/testing'

import { NewDiscountService } from '../../newDiscount.service'
import {
  PrivateNewDiscountAdminController,
  PrivateNewDiscountController,
  PublicNewDiscountController,
} from '../../newDiscount.controller'
import { NationalRegistryService } from '../../../nationalRegistry'
import { FlightService } from '../../../flight'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import { UserService } from '../../../user/user.service'
import {
  NationalRegistryClientConfig,
  NationalRegistryClientModule,
} from '@island.is/clients/national-registry-v2'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { AirlineUser } from '../../../user/user.model'
import { createTestUser } from '../../../../../../test/createTestUser'
import { mockDiscount, mockExplicitDiscount } from '../e2e/mocks'

const auth: AuthUser = {
  nationalId: '1326487905',
  scope: [AirDiscountSchemeScope.default],
  authorization: '',
  client: '',
}

describe('DiscountController', () => {
  let privateDiscountController: PrivateNewDiscountController
  let privateDiscountAdminController: PrivateNewDiscountAdminController
  let publicDiscountController: PublicNewDiscountController
  let discountService: NewDiscountService
  let nationalRegistryService: NationalRegistryService
  let userService: UserService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryClientConfig],
        }),
        NationalRegistryClientModule,
      ],
      providers: [
        PrivateNewDiscountController,
        PrivateNewDiscountAdminController,
        PublicNewDiscountController,
        UserService,
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
          })),
        },
        {
          provide: NewDiscountService,
          useClass: jest.fn(() => ({
            getDiscountCodeForUser: () => ({}),
            createNewDiscountCode: () => ({}),
            getDiscountByCode: () => ({}),
            createNewExplicitDiscountCode: () => ({}),
          })),
        },
        {
          provide: NationalRegistryService,
          useClass: jest.fn(() => ({
            getUser: () => ({}),
          })),
        },
        {
          provide: FlightService,
          useClass: jest.fn(() => ({
            countThisYearsConnectedFlightsByNationalId: () => 0,
            findThisYearsConnectableFlightsByNationalId: () => [],
          })),
        },
      ],
    }).compile()

    publicDiscountController = moduleRef.get(PublicNewDiscountController)
    privateDiscountController = moduleRef.get(PrivateNewDiscountController)
    privateDiscountAdminController = moduleRef.get(
      PrivateNewDiscountAdminController,
    )
    discountService = moduleRef.get(NewDiscountService)
    nationalRegistryService = moduleRef.get(NationalRegistryService)
    userService = moduleRef.get(UserService)
  })

  describe('getCurrentDiscountByNationalId', () => {
    it('should return discount', async () => {
      const nationalId = '1234567890'
      const discount = mockDiscount
      const getDiscountByNationalIdSpy = jest
        .spyOn(discountService, 'getDiscountCodeForUser')
        .mockImplementation(() => Promise.resolve(discount as any))

      const result =
        await privateDiscountController.getCurrentDiscountByNationalId(
          {
            nationalId,
          },
          auth,
        )

      expect(getDiscountByNationalIdSpy).toHaveBeenCalledWith(auth, nationalId)
      expect(result).toEqual(discount)
    })
    it('should return null when discountService returns null', async () => {
      const nationalId = '1234567890'
      const getDiscountByNationalIdSpy = jest
        .spyOn(discountService, 'getDiscountCodeForUser')
        .mockImplementation(() => Promise.resolve(null))

      const result =
        await privateDiscountController.getCurrentDiscountByNationalId(
          {
            nationalId,
          },
          auth,
        )

      expect(getDiscountByNationalIdSpy).toHaveBeenCalledWith(auth, nationalId)
      expect(result).toEqual(null)
    })
  })

  describe('createDiscountCode', () => {
    it('should return discount', async () => {
      const nationalId = '1234567890'
      const testUser = createTestUser()
      const discount = mockDiscount
      const createDiscountCodeSpy = jest
        .spyOn(discountService, 'createNewDiscountCode')
        .mockImplementation(() => Promise.resolve(discount as any))
      const getUserInfoByNationalIdSpy = jest
        .spyOn(userService, 'getUserInfoByNationalId')
        .mockImplementation(() => Promise.resolve(testUser))

      const result = await privateDiscountController.createDiscountCode(
        {
          nationalId,
        },
        {
          destination: 'RKV',
          origin: 'GRY',
          isRoundTrip: true,
        },
        auth,
      )

      expect(getUserInfoByNationalIdSpy).toHaveBeenCalledWith(nationalId, auth)
      expect(createDiscountCodeSpy).toHaveBeenCalledWith(
        testUser,
        nationalId,
        'GRY',
        'RKV',
        true,
      )
      expect(result).toEqual(discount)
    })

    it("should throw an error because discount wasn't created", async () => {
      const nationalId = '1234567890'
      const testUser = createTestUser()
      const createDiscountCodeSpy = jest
        .spyOn(discountService, 'createNewDiscountCode')
        .mockImplementation(() => Promise.resolve(null))
      const getUserInfoByNationalIdSpy = jest
        .spyOn(userService, 'getUserInfoByNationalId')
        .mockImplementation(() => Promise.resolve(testUser))

      try {
        await privateDiscountController.createDiscountCode(
          {
            nationalId,
          },
          {
            destination: 'RKV',
            origin: 'GRY',
            isRoundTrip: true,
          },
          auth,
        )
        expect('This should not happen').toEqual('')
      } catch (e) {
        expect(getUserInfoByNationalIdSpy).toHaveBeenCalledWith(
          nationalId,
          auth,
        )
        expect(createDiscountCodeSpy).toHaveBeenCalledWith(
          testUser,
          nationalId,
          'GRY',
          'RKV',
          true,
        )
        expect(e.response).toEqual({
          statusCode: 501,
          error: 'Not Implemented',
          message: `Could not create discount`,
        })
      }
    })

    it('should throw an error because user is not found', async () => {
      const nationalId = '1234567890'
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))
      const createDiscountCodeSpy = jest.spyOn(
        discountService,
        'createNewDiscountCode',
      )

      try {
        await privateDiscountController.createDiscountCode(
          {
            nationalId,
          },
          {
            destination: 'RKV',
            origin: 'GRY',
            isRoundTrip: true,
          },
          auth,
        )
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(getUserSpy).toHaveBeenCalledWith(nationalId, auth)
        expect(createDiscountCodeSpy).not.toHaveBeenCalled()
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `User<${nationalId}> not found`,
        })
      }
    })
  })

  describe('getUserByDiscountCode', () => {
    it('should return a user', async () => {
      const discountCode = 'ABCDEFG'
      const testUser = createTestUser()
      const airlineUser = new AirlineUser(testUser, testUser.fund)
      const nationalId = testUser.nationalId
      const discount = {
        ...mockDiscount,
        user: testUser,
      }

      const getDiscountByDiscountCodeSpy = jest
        .spyOn(discountService, 'getDiscountByCode')
        .mockImplementation(() => Promise.resolve(discount as any))

      const result = await publicDiscountController.getUserByDiscountCode(
        {
          discountCode,
        },
        auth,
      )

      expect(getDiscountByDiscountCodeSpy).toHaveBeenCalledWith(
        auth,
        discountCode,
      )
      expect(result).toStrictEqual(airlineUser)
    })

    it('should return not found error when discount code does is invalid', async () => {
      const discountCode = 'ABCDEFG'

      jest
        .spyOn(discountService, 'getDiscountByCode')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await publicDiscountController.getUserByDiscountCode(
          { discountCode },
          auth,
        )
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(e.response).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: `Discount code is invalid`,
        })
      }
    })

    it('should return not found error when discount doesnt include a user', async () => {
      const discountCode = 'ABCDEFG'
      const testUser = createTestUser()
      const nationalId = testUser.nationalId
      const discount = {
        ...mockDiscount,
        nationalId: nationalId,
      }

      const getDiscountByDiscountCodeSpy = jest
        .spyOn(discountService, 'getDiscountByCode')
        .mockImplementation(() => Promise.resolve(discount as any))
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(testUser))

      try {
        await publicDiscountController.getUserByDiscountCode(
          { discountCode },
          auth,
        )
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `User<${nationalId}> not found`,
        })
      }
      expect(getDiscountByDiscountCodeSpy).toHaveBeenCalledWith(
        auth,
        discountCode,
      )
    })
  })

  describe('createExplicitDiscountCode', () => {
    it('should return discount', async () => {
      const nationalId = '1010302399'

      const postalcode = 600
      const comment = 'This is a comment'
      const numberOfDaysUntilExpiration = 1
      const discount = mockExplicitDiscount

      const createExplicitDiscountCodeSpy = jest
        .spyOn(discountService, 'createNewExplicitDiscountCode')
        .mockImplementation(() => Promise.resolve(discount as any))

      const result =
        await privateDiscountAdminController.createExplicitDiscountCode(
          {
            comment,
            nationalId,
            postalcode,
            numberOfDaysUntilExpiration,
            origin: 'GRY',
            destination: 'RKV',
            isRoundTrip: true,
          },
          auth,
        )

      expect(createExplicitDiscountCodeSpy).toHaveBeenCalledWith(
        auth,
        nationalId,
        'GRY',
        'RKV',
        true,
      )
      expect(result).toEqual(discount)
    })
    it('should throw error if discount is not created', async () => {
      const nationalId = '1010302399'

      const postalcode = 600
      const comment = 'This is a comment'
      const numberOfDaysUntilExpiration = 1

      const createExplicitDiscountCodeSpy = jest
        .spyOn(discountService, 'createNewExplicitDiscountCode')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await privateDiscountAdminController.createExplicitDiscountCode(
          {
            comment,
            nationalId,
            postalcode,
            numberOfDaysUntilExpiration,
            origin: 'GRY',
            destination: 'RKV',
            isRoundTrip: true,
          },
          auth,
        )
        expect('This should not happen').toEqual('')
      } catch (e) {
        expect(createExplicitDiscountCodeSpy).toHaveBeenCalledWith(
          auth,
          nationalId,
          'GRY',
          'RKV',
          true,
        )
        expect(e.response).toEqual({
          statusCode: 501,
          error: 'Not Implemented',
          message: `Could not create explicit discount`,
        })
      }
    })
  })
})
