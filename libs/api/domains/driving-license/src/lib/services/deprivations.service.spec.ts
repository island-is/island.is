import { DeprivationsService } from './deprivations.service'
import { PenaltyPointsClientService } from '@island.is/clients/driving-license'
import type { User } from '@island.is/auth-nest-tools'
import type { DtoV5DeprivationDto } from '@island.is/clients/driving-license'

const MOCK_USER = {} as User

const createDeprivation = (
  overrides: Partial<DtoV5DeprivationDto>,
): DtoV5DeprivationDto => ({
  dateFrom: new Date('2020-01-01'),
  ...overrides,
})

const createService = (deprivations: DtoV5DeprivationDto[]) => {
  const penaltyPointsClientService = {
    deprivations: jest.fn().mockResolvedValue(deprivations),
  } as unknown as PenaltyPointsClientService

  return new DeprivationsService(penaltyPointsClientService)
}

describe('DeprivationsService', () => {
  describe('getDeprivations', () => {
    it('returns current: undefined and history: [] for an empty list', async () => {
      const service = createService([])

      const response = await service.getDeprivations(MOCK_USER)

      expect(response).toStrictEqual({ current: undefined, history: [] })
    })

    it('returns a single item as current with an empty history', async () => {
      const service = createService([
        createDeprivation({ dateFrom: new Date('2020-01-01') }),
      ])

      const response = await service.getDeprivations(MOCK_USER)

      expect(response.current).toBeDefined()
      expect(response.current?.dateFrom).toStrictEqual(new Date('2020-01-01'))
      expect(response.history).toStrictEqual([])
    })

    it('sets current to the most recent item by dateFrom and puts the rest in history', async () => {
      const service = createService([
        createDeprivation({ dateFrom: new Date('2018-01-01') }),
        createDeprivation({ dateFrom: new Date('2022-06-15') }),
        createDeprivation({ dateFrom: new Date('2020-03-10') }),
      ])

      const response = await service.getDeprivations(MOCK_USER)

      expect(response.current?.dateFrom).toStrictEqual(new Date('2022-06-15'))
      expect(response.history).toHaveLength(2)
      expect(response.history.map((h) => h.dateFrom)).toStrictEqual(
        expect.arrayContaining([
          new Date('2018-01-01'),
          new Date('2020-03-10'),
        ]),
      )
    })

    it('filters out items with no dateFrom', async () => {
      const service = createService([
        createDeprivation({ dateFrom: undefined }),
        createDeprivation({ dateFrom: new Date('2021-01-01') }),
      ])

      const response = await service.getDeprivations(MOCK_USER)

      expect(response.current).toBeDefined()
      expect(response.history).toStrictEqual([])
    })

    describe('active computation', () => {
      it('is true when dateTo is undefined', async () => {
        const service = createService([
          createDeprivation({ dateTo: undefined }),
        ])

        const response = await service.getDeprivations(MOCK_USER)

        expect(response.current?.active).toBe(true)
      })

      it('is true when dateTo is in the future', async () => {
        const futureDate = new Date()
        futureDate.setFullYear(futureDate.getFullYear() + 1)

        const service = createService([
          createDeprivation({ dateTo: futureDate }),
        ])

        const response = await service.getDeprivations(MOCK_USER)

        expect(response.current?.active).toBe(true)
      })

      it('is false when dateTo is in the past', async () => {
        const pastDate = new Date()
        pastDate.setFullYear(pastDate.getFullYear() - 1)

        const service = createService([createDeprivation({ dateTo: pastDate })])

        const response = await service.getDeprivations(MOCK_USER)

        expect(response.current?.active).toBe(false)
      })
    })

    it('maps retakeLicense to retakeRequired', async () => {
      const service = createService([
        createDeprivation({ retakeLicense: true }),
      ])

      const response = await service.getDeprivations(MOCK_USER)

      expect(response.current?.retakeRequired).toBe(true)
    })
  })
})
