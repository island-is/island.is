import DataLoader from 'dataloader'
import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import type { User } from '@island.is/auth-nest-tools'

import { UsedFlightLeg } from '../models/usedFlightLeg.model'
import { MemberService } from './member.service'
import { UsedFlightLegsLoader } from './usedFlightLegs.loader'

describe('ApiDomains: UsedFlightLegsLoader', () => {
  let loader: UsedFlightLegsLoader

  let mockGetUsedFlightLegsByNationalId: jest.MockedFunction<
    typeof MemberService.prototype.getUsedFlightLegsByNationalId
  >

  const fabUser = (nationalId: string): User => ({
    authorization: '',
    client: '',
    nationalId,
    scope: [],
  })

  const fabUsedFlightLeg = (
    travel: string,
    bookingDate: Date,
  ): UsedFlightLeg => ({
    travel,
    bookingDate,
  })

  beforeEach(async () => {
    mockGetUsedFlightLegsByNationalId = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsedFlightLegsLoader,
        {
          provide: MemberService,
          useValue: {
            getUsedFlightLegsByNationalId: mockGetUsedFlightLegsByNationalId,
          },
        },
      ],
    }).compile()

    loader = module.get<UsedFlightLegsLoader>(UsedFlightLegsLoader)
  })

  it('should be defined', () => {
    expect(loader).toBeDefined()
  })

  it('should batch multiple load calls into a single service call', async () => {
    const user = fabUser('0000000001')
    const flightLegsMap = new Map<string, UsedFlightLeg[]>()
    flightLegsMap.set('0000000001', [fabUsedFlightLeg('REK - AEY', new Date())])
    flightLegsMap.set('0000000002', [fabUsedFlightLeg('KEF - AEY', new Date())])

    mockGetUsedFlightLegsByNationalId.mockResolvedValue(flightLegsMap)

    const dataLoader = new DataLoader((ids: readonly string[]) =>
      loader.loadUsedFlightLegs(user, ids),
    )

    const [result1, result2] = await Promise.all([
      dataLoader.load('0000000001'),
      dataLoader.load('0000000002'),
    ])

    expect(result1).toHaveLength(1)
    expect(result1[0].travel).toBe('REK - AEY')
    expect(result2).toHaveLength(1)
    expect(result2[0].travel).toBe('KEF - AEY')
    expect(mockGetUsedFlightLegsByNationalId).toHaveBeenCalledTimes(1)
    expect(mockGetUsedFlightLegsByNationalId).toHaveBeenCalledWith(user)
  })

  it('should return results in the order of keys requested', async () => {
    const user = fabUser('0000000001')
    const flightLegsMap = new Map<string, UsedFlightLeg[]>()
    flightLegsMap.set('0000000003', [fabUsedFlightLeg('KEF - VIK', new Date())])
    flightLegsMap.set('0000000001', [fabUsedFlightLeg('REK - AEY', new Date())])
    flightLegsMap.set('0000000002', [fabUsedFlightLeg('KEF - AEY', new Date())])

    mockGetUsedFlightLegsByNationalId.mockResolvedValue(flightLegsMap)

    const dataLoader = new DataLoader((ids: readonly string[]) =>
      loader.loadUsedFlightLegs(user, ids),
    )

    const results = await Promise.all([
      dataLoader.load('0000000001'),
      dataLoader.load('0000000002'),
      dataLoader.load('0000000003'),
    ])

    expect(results[0][0].travel).toBe('REK - AEY')
    expect(results[1][0].travel).toBe('KEF - AEY')
    expect(results[2][0].travel).toBe('KEF - VIK')
  })

  it('should return empty array for missing keys', async () => {
    const user = fabUser('0000000001')
    const flightLegsMap = new Map<string, UsedFlightLeg[]>()
    flightLegsMap.set('0000000001', [fabUsedFlightLeg('REK - AEY', new Date())])

    mockGetUsedFlightLegsByNationalId.mockResolvedValue(flightLegsMap)

    const dataLoader = new DataLoader((ids: readonly string[]) =>
      loader.loadUsedFlightLegs(user, ids),
    )

    const [result1, resultMissing] = await Promise.all([
      dataLoader.load('0000000001'),
      dataLoader.load('0000000999'),
    ])

    expect(result1).toHaveLength(1)
    expect(resultMissing).toEqual([])
  })

  it('should reject when no user is provided', async () => {
    await expect(
      loader.loadUsedFlightLegs(undefined, ['0000000001']),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('should handle multiple flight legs per nationalId', async () => {
    const user = fabUser('0000000001')
    const date1 = new Date('2026-01-01')
    const date2 = new Date('2026-02-01')

    const flightLegsMap = new Map<string, UsedFlightLeg[]>()
    flightLegsMap.set('0000000001', [
      fabUsedFlightLeg('REK - AEY', date1),
      fabUsedFlightLeg('AEY - REK', date2),
    ])

    mockGetUsedFlightLegsByNationalId.mockResolvedValue(flightLegsMap)

    const dataLoader = new DataLoader((ids: readonly string[]) =>
      loader.loadUsedFlightLegs(user, ids),
    )

    const result = await dataLoader.load('0000000001')

    expect(result).toHaveLength(2)
    expect(result[0].travel).toBe('REK - AEY')
    expect(result[1].travel).toBe('AEY - REK')
  })

  it('should call service only once per unique batch', async () => {
    const user = fabUser('0000000001')
    const flightLegsMap = new Map<string, UsedFlightLeg[]>()
    flightLegsMap.set('0000000001', [fabUsedFlightLeg('REK - AEY', new Date())])

    mockGetUsedFlightLegsByNationalId.mockResolvedValue(flightLegsMap)

    const dataLoader = new DataLoader((ids: readonly string[]) =>
      loader.loadUsedFlightLegs(user, ids),
    )

    const [result1, result2, result3] = await Promise.all([
      dataLoader.load('0000000001'),
      dataLoader.load('0000000001'),
      dataLoader.load('0000000001'),
    ])

    expect(result1).toEqual(result2)
    expect(result2).toEqual(result3)
    expect(mockGetUsedFlightLegsByNationalId).toHaveBeenCalledTimes(1)
  })
})
