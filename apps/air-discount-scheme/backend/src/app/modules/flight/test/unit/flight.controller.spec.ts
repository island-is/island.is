import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { PublicFlightController } from '../../flight.controller'
import { FlightService } from '../../flight.service'
import { CreateFlightBody } from '../../dto'
import { Flight } from '../../flight.model'
import { DiscountService, Discount } from '../../../discount'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../../../nationalRegistry'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { createTestUser } from '../../../../../../test/createTestUser'

describe('PublicFlightController', () => {
  let publicFlightController: PublicFlightController
  let flightService: FlightService
  let discountService: DiscountService
  let nationalRegistryService: NationalRegistryService

  const airline = 'ernir'
  const nationalId = '0101302399'
  const flight = {
    id: '70de7be1-6b6d-4ec3-8063-be55e241d488',
    nationalId: '010130xxx9',
    bookingDate: new Date('2020-10-05T14:48:00.000Z'),
    flightLegs: [
      {
        id: 'eb5f2db9-fa03-4382-bb3b-401fd86f8d59',
        origin: 'REK',
        destination: 'AEY',
        originalPrice: 100000,
        discountPrice: 60000,
        date: new Date('2021-10-05T14:48:00.000Z'),
      },
    ],
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PublicFlightController,
        {
          provide: FlightService,
          useClass: jest.fn(() => ({
            isADSPostalCode: () => ({}),
            countThisYearsFlightLegsByNationalId: () => ({}),
            create: () => ({}),
            findOne: () => ({}),
            delete: () => ({}),
            deleteFlightLeg: () => ({}),
          })),
        },
        {
          provide: getModelToken(Flight),
          useClass: jest.fn(() => ({})),
        },
        {
          provide: DiscountService,
          useClass: jest.fn(() => ({
            getDiscountByDiscountCode: () => ({}),
            useDiscount: () => ({}),
            reactivateDiscount: () => ({}),
          })),
        },
        {
          provide: NationalRegistryService,
          useClass: jest.fn(() => ({
            getUser: () => ({}),
          })),
        },
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
            del: () => ({}),
            store: {
              ttl: () => ({}),
            },
          })),
        },
      ],
    }).compile()

    publicFlightController = moduleRef.get<PublicFlightController>(
      PublicFlightController,
    )
    flightService = moduleRef.get<FlightService>(FlightService)
    discountService = moduleRef.get<DiscountService>(DiscountService)
    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )

    Date.now = jest.fn(() => 1597760782018)
  })

  describe('create', () => {
    const discountCode = 'ABCDEFG'
    const discount = new Discount(
      createTestUser(),
      discountCode,
      [],
      nationalId,
      0,
    )
    const flightDto: CreateFlightBody = {
      bookingDate: new Date('2020-10-05T14:48:00.000Z'),
      flightLegs: [
        {
          origin: 'REK',
          destination: 'AEY',
          originalPrice: 100000,
          discountPrice: 60000,
          date: new Date('2021-10-05T14:48:00.000Z'),
          cooperation: '',
        },
      ],
    }

    const user: NationalRegistryUser = {
      nationalId,
      firstName: 'Jón',
      gender: 'kk',
      lastName: 'Jónsson',
      middleName: 'Gunnar',
      address: 'Bessastaðir 1',
      postalcode: 225,
      city: 'Álftanes',
    }
    const flightLegs = {
      used: 2,
      unused: 2,
      total: 4,
    }

    it('should create flight', async () => {
      const request: any = { airline }
      jest
        .spyOn(discountService, 'getDiscountByDiscountCode')
        .mockImplementation(() => Promise.resolve(discount))
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      jest
        .spyOn(flightService, 'isADSPostalCode')
        .mockImplementation(() => true)
      jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))
      const useDiscountSpy = jest.spyOn(discountService, 'useDiscount')
      jest
        .spyOn(flightService as any, 'create')
        .mockImplementation(() => Promise.resolve(flight))

      const result = await publicFlightController.create(
        { discountCode },
        flightDto,
        request,
      )

      expect(useDiscountSpy).toHaveBeenCalledWith(
        discountCode,
        nationalId,
        flight.id,
        false,
      )
      expect(result).toEqual(flight)
    })

    it('should fail if discountCode is invalid', async () => {
      const request: any = { airline }
      jest
        .spyOn(discountService, 'getDiscountByDiscountCode')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await publicFlightController.create(
          { discountCode },
          flightDto,
          request,
        )
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(e.response).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Discount code is invalid',
        })
      }
    })

    it('should fail if discount is invalid', async () => {
      const request: any = { airline }
      jest
        .spyOn(discountService, 'getDiscountByDiscountCode')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await publicFlightController.create(
          { discountCode },
          flightDto,
          request,
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

    it('should fail if user does not have flight quota', async () => {
      const request: any = { airline }
      jest
        .spyOn(discountService, 'getDiscountByDiscountCode')
        .mockImplementation(() => Promise.resolve(discount))
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      jest
        .spyOn(flightService, 'isADSPostalCode')
        .mockImplementation(() => true)
      jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve({ ...flightLegs, unused: 0 }))

      try {
        await publicFlightController.create(
          { discountCode },
          flightDto,
          request,
        )
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(e.response).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Flight leg quota is exceeded',
        })
      }
    })
  })

  describe('delete', () => {
    it('should delete flight', async () => {
      const request: any = { airline }
      jest
        .spyOn(flightService as any, 'findOne')
        .mockImplementation(() => Promise.resolve(flight))
      const deleteSpy = jest.spyOn(flightService, 'delete')
      const reactivateDiscountSpy = jest.spyOn(
        discountService,
        'reactivateDiscount',
      )

      await publicFlightController.delete({ flightId: flight.id }, request)

      expect(reactivateDiscountSpy).toHaveBeenCalledWith(flight.id)
      expect(deleteSpy).toHaveBeenCalledWith(flight)
    })

    it('should fail if flight is not found', async () => {
      const request: any = { airline }
      jest
        .spyOn(flightService, 'findOne')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await publicFlightController.delete({ flightId: flight.id }, request)
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `Flight<${flight.id}> not found`,
        })
      }
    })
  })

  describe('deleteFlightLeg', () => {
    it('should delete flight', async () => {
      const request: any = { airline }
      jest
        .spyOn(flightService as any, 'findOne')
        .mockImplementation(() => Promise.resolve(flight))
      const deleteFlightLegSpy = jest.spyOn(flightService, 'deleteFlightLeg')

      await publicFlightController.deleteFlightLeg(
        { flightId: flight.id, flightLegId: flight.flightLegs[0].id },
        request,
      )

      expect(deleteFlightLegSpy).toHaveBeenCalledWith(flight.flightLegs[0])
    })

    it('should fail if flight is not found', async () => {
      const request: any = { airline }
      jest
        .spyOn(flightService, 'findOne')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await publicFlightController.deleteFlightLeg(
          { flightId: flight.id, flightLegId: flight.flightLegs[0].id },
          request,
        )
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `Flight<${flight.id}> not found`,
        })
      }
    })

    it('should fail if flightLeg is not found', async () => {
      const request: any = { airline }
      jest
        .spyOn(flightService, 'findOne')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await publicFlightController.deleteFlightLeg(
          {
            flightId: flight.id,
            flightLegId: '585b38d3-1695-40d9-9f09-305e3b6c96f7',
          },
          request,
        )
        expect('This should not happen').toEqual('')
      } catch (e: any) {
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `Flight<${flight.id}> not found`,
        })
      }
    })
  })
})
