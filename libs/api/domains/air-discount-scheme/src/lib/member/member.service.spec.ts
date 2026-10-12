import { Test, TestingModule } from '@nestjs/testing'

import type { User } from '@island.is/auth-nest-tools'
import {
  AirDiscountSchemeClientService,
  type Discount,
  type Flight,
  type User as GeneratedUser,
  UserGenderEnum,
  type UserInfo,
} from '@island.is/clients/air-discount-scheme'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { DiscountService } from '../discount/discount.service'
import { MemberService } from './member.service'

describe('ApiDomains: MemberService', () => {
  let service: MemberService

  // Mock function handles
  let mockGetUserRelations: jest.MockedFunction<
    typeof AirDiscountSchemeClientService.prototype.getUserRelations
  >
  let mockGetCurrentDiscount: jest.MockedFunction<
    typeof AirDiscountSchemeClientService.prototype.getCurrentDiscount
  >
  let mockCreateDiscount: jest.MockedFunction<
    typeof AirDiscountSchemeClientService.prototype.createDiscount
  >
  let mockGetUserAndRelationsFlights: jest.MockedFunction<
    typeof AirDiscountSchemeClientService.prototype.getUserAndRelationsFlights
  >

  const fabAuthUser = (nationalId: string): User => ({
    authorization: '',
    client: '',
    nationalId,
    scope: [],
  })

  const fabUser = (nationalId: string): GeneratedUser => ({
    address: '123 Elm Street',
    city: 'Reykjavík',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Middle',
    gender: UserGenderEnum.kk,
    nationalId,
    postalcode: 101,
    fund: {
      credit: 10,
      total: 10,
      used: 0,
    },
  })

  const fabUserInfo = (): UserInfo => ({
    age: 30,
    gender: UserGenderEnum.kk,
    postalCode: 101,
  })

  const fabDiscount = (nationalId: string): Discount => ({
    user: fabUser(nationalId),
    connectionDiscountCodes: [],
    discountCode: 'TESTCODE123',
    expiresIn: 86400,
    nationalId,
  })

  const fabExpiredDiscount = (nationalId: string): Discount => ({
    user: fabUser(nationalId),
    connectionDiscountCodes: [],
    discountCode: 'EXPIREDCODE',
    expiresIn: 3600,
    nationalId,
  })

  const fabFlight = (nationalId: string, bookingDate: Date): Flight => ({
    id: 'flight1',
    userInfo: fabUserInfo(),
    nationalId,
    bookingDate,
    flightLegs: [
      {
        id: 'leg1',
        airline: 'Icelandair',
        cooperation: 'partner',
        flight: {
          id: 'flight1',
          userInfo: fabUserInfo(),
          nationalId,
          bookingDate,
          created: new Date('2026-01-01'),
          modified: new Date('2026-01-01'),
          connectable: true,
        },
        origin: 'REK',
        destination: 'AEY',
        isConnectingFlight: false,
        originalPrice: 100,
        discountPrice: 50,
        financialState: 'paid',
        financialStateUpdated: new Date('2026-01-01'),
        date: new Date('2026-06-01'),
        created: new Date('2026-01-01'),
        modified: new Date('2026-01-01'),
      },
    ],
    created: new Date('2026-01-01'),
    modified: new Date('2026-01-01'),
    connectable: true,
  })

  beforeEach(async () => {
    // Create typed jest.fn handles
    mockGetUserRelations = jest.fn()
    mockGetCurrentDiscount = jest.fn()
    mockCreateDiscount = jest.fn()
    mockGetUserAndRelationsFlights = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        DiscountService,
        {
          provide: AirDiscountSchemeClientService,
          useValue: {
            getUserRelations: mockGetUserRelations,
            getCurrentDiscount: mockGetCurrentDiscount,
            createDiscount: mockCreateDiscount,
            getUserAndRelationsFlights: mockGetUserAndRelationsFlights,
          },
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: { error: jest.fn() },
        },
      ],
    }).compile()

    service = module.get<MemberService>(MemberService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getMembers', () => {
    it('should return members with name and nationalId', async () => {
      const nationalId = '0000000001'
      const user = fabAuthUser(nationalId)
      const relation = fabUser(nationalId)

      mockGetUserRelations.mockResolvedValue([relation])

      const members = await service.getMembers(user)

      expect(members).toHaveLength(1)
      expect(members[0].name).toBe('John Doe')
      expect(members[0].nationalId).toBe(nationalId)
    })

    it('should return multiple members', async () => {
      const user1Id = '0000000001'
      const user2Id = '0000000002'
      const user = fabAuthUser(user1Id)

      const relation1 = fabUser(user1Id)
      const relation2 = fabUser(user2Id)

      mockGetUserRelations.mockResolvedValue([relation1, relation2])

      const members = await service.getMembers(user)

      expect(members).toHaveLength(2)
      expect(members[0].nationalId).toBe(user1Id)
      expect(members[1].nationalId).toBe(user2Id)
    })
  })

  describe('getBenefit', () => {
    it('should return benefit with fund and code when existing discount is found', async () => {
      const nationalId = '0000000001'
      const user = fabAuthUser(nationalId)
      const discount = fabDiscount(nationalId)

      mockGetCurrentDiscount.mockResolvedValue(discount)

      const benefit = await service.getBenefit(user, nationalId)

      expect(benefit).toBeDefined()
      expect(benefit?.fund).toBeDefined()
      expect(benefit?.fund.credit).toBe(10)
      expect(benefit?.discountCode).toBe('TESTCODE123')
    })

    it('should use createDiscount when getCurrentDiscount returns null', async () => {
      const nationalId = '0000000002'
      const user = fabAuthUser(nationalId)
      const discount = fabDiscount(nationalId)

      mockGetCurrentDiscount.mockResolvedValue(null)
      mockCreateDiscount.mockResolvedValue(discount)

      const benefit = await service.getBenefit(user, nationalId)

      expect(mockCreateDiscount).toHaveBeenCalledWith(user, nationalId)
      expect(benefit?.discountCode).toBe('TESTCODE123')
    })

    it('should return null when both getCurrentDiscount and createDiscount return null', async () => {
      const nationalId = '0000000003'
      const user = fabAuthUser(nationalId)

      mockGetCurrentDiscount.mockResolvedValue(null)
      mockCreateDiscount.mockResolvedValue(null)

      const benefit = await service.getBenefit(user, nationalId)

      expect(benefit).toBeNull()
    })

    it('should return null when fund credit and used are both 0', async () => {
      const nationalId = '0000000004'
      const user = fabAuthUser(nationalId)
      const discount = fabDiscount(nationalId)
      discount.user.fund.credit = 0
      discount.user.fund.used = 0

      mockGetCurrentDiscount.mockResolvedValue(discount)

      const benefit = await service.getBenefit(user, nationalId)

      expect(benefit).toBeNull()
    })

    it('should set discountCode to null when expiresIn <= 7200', async () => {
      const nationalId = '0000000006'
      const user = fabAuthUser(nationalId)
      const discount = fabExpiredDiscount(nationalId)

      mockGetCurrentDiscount.mockResolvedValue(discount)

      const benefit = await service.getBenefit(user, nationalId)

      expect(benefit?.discountCode).toBeNull()
    })
  })

  describe('getUsedFlightLegsByNationalId', () => {
    it('should return flights grouped by nationalId', async () => {
      const user1Id = '0000000007'
      const user2Id = '0000000008'
      const user = fabAuthUser(user1Id)

      const bookingDate1 = new Date('2026-02-01')
      const bookingDate2 = new Date('2026-03-01')

      mockGetUserAndRelationsFlights.mockResolvedValue([
        fabFlight(user1Id, bookingDate1),
        fabFlight(user2Id, bookingDate2),
      ])

      const result = await service.getUsedFlightLegsByNationalId(user)

      expect(result.get(user1Id)).toHaveLength(1)
      expect(result.get(user1Id)?.[0].travel).toBe('REK - AEY')
      expect(result.get(user1Id)?.[0].bookingDate).toEqual(bookingDate1)

      expect(result.get(user2Id)).toHaveLength(1)
      expect(result.get(user2Id)?.[0].bookingDate).toEqual(bookingDate2)
    })

    it('should return empty result for unknown nationalId', async () => {
      const unknownNationalId = '0000000099'
      const user = fabAuthUser('0000000009')

      mockGetUserAndRelationsFlights.mockResolvedValue([])

      const result = await service.getUsedFlightLegsByNationalId(user)

      expect(result.get(unknownNationalId)).toBeUndefined()
    })

    it('should format travel as "origin - destination"', async () => {
      const nationalId = '0000000010'
      const user = fabAuthUser(nationalId)
      const bookingDate = new Date('2026-05-01')

      mockGetUserAndRelationsFlights.mockResolvedValue([
        fabFlight(nationalId, bookingDate),
      ])

      const result = await service.getUsedFlightLegsByNationalId(user)

      expect(result.get(nationalId)?.[0].travel).toBe('REK - AEY')
    })

    it('should accumulate multiple flights for same nationalId', async () => {
      const nationalId = '0000000011'
      const user = fabAuthUser(nationalId)
      const bookingDate1 = new Date('2026-02-01')
      const bookingDate2 = new Date('2026-03-01')

      mockGetUserAndRelationsFlights.mockResolvedValue([
        fabFlight(nationalId, bookingDate1),
        fabFlight(nationalId, bookingDate2),
      ])

      const result = await service.getUsedFlightLegsByNationalId(user)

      expect(result.get(nationalId)).toHaveLength(2)
      expect(result.get(nationalId)?.[0].bookingDate).toEqual(bookingDate1)
      expect(result.get(nationalId)?.[1].bookingDate).toEqual(bookingDate2)
    })
  })
})
