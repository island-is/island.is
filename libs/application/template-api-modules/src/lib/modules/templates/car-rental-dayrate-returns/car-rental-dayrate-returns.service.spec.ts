import { Test, TestingModule } from '@nestjs/testing'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { FetchError } from '@island.is/clients/middlewares'
import {
  RskRentalDayRateClient,
  RskRentalDaysClient,
} from '@island.is/clients-rental-day-rate'
import { AttachmentS3Service } from '../../shared/services'
import { CarRentalDayrateReturnsService } from './car-rental-dayrate-returns.service'

const FROZEN_NOW = new Date('2026-09-15T10:00:00.000Z')
const PERIOD = '2026-08'

describe('CarRentalDayrateReturnsService', () => {
  let service: CarRentalDayrateReturnsService
  let getDayRateEntries: jest.Mock
  let getPeriodRegistration: jest.Mock

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(FROZEN_NOW)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(async () => {
    getDayRateEntries = jest.fn().mockResolvedValue([])
    getPeriodRegistration = jest
      .fn()
      .mockResolvedValue({ year: 2026, month: 8, entries: [] })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarRentalDayrateReturnsService,
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: AttachmentS3Service, useValue: { getFiles: jest.fn() } },
        {
          provide: RskRentalDayRateClient,
          useValue: {
            defaultApiWithAuth: () => ({
              apiDayRateEntriesEntityIdPeriodsPeriodGet: getDayRateEntries,
            }),
          },
        },
        {
          provide: RskRentalDaysClient,
          useValue: {
            rentalDaysApiWithAuth: () => ({
              apiRentalDaysEntityIdPeriodsPeriodGet: getPeriodRegistration,
              apiRentalDaysEntityIdPost: jest.fn(),
            }),
          },
        },
      ],
    }).compile()

    service = module.get<CarRentalDayrateReturnsService>(
      CarRentalDayrateReturnsService,
    )
  })

  const run = () =>
    service.getPreviousPeriodDayRateReturns({
      auth: createCurrentUser(),
      application: createApplication(),
    } as Parameters<typeof service.getPreviousPeriodDayRateReturns>[0])

  describe('getPreviousPeriodDayRateReturns', () => {
    it('asks Skatturinn for the previous month', async () => {
      getPeriodRegistration.mockResolvedValue({
        year: 2026,
        month: 8,
        entries: [{ permno: 'AB123', availableDays: 31 }],
      })

      await run()

      expect(getPeriodRegistration).toHaveBeenCalledWith(
        expect.objectContaining({ period: PERIOD }),
      )
      expect(getDayRateEntries).toHaveBeenCalledWith(
        expect.objectContaining({ period: PERIOD }),
      )
    })

    it('maps availableDays to prevPeriodTotalDays', async () => {
      getPeriodRegistration.mockResolvedValue({
        year: 2026,
        month: 8,
        entries: [{ permno: 'AB123', availableDays: 12 }],
      })

      const [record] = await run()

      expect(record.prevPeriodTotalDays).toBe(12)
    })

    it('omits entries with no permno', async () => {
      getPeriodRegistration.mockResolvedValue({
        year: 2026,
        month: 8,
        entries: [
          { permno: null, availableDays: 12 },
          { permno: 'AB123', availableDays: 31 },
        ],
      })

      const records = await run()

      expect(records.map((r) => r.permno)).toEqual(['AB123'])
    })

    it('leaves dayRateEntryId undefined for a permno with no matching day rate entry', async () => {
      getDayRateEntries.mockResolvedValue([{ id: 1, fastnr: 'OTHER' }])
      getPeriodRegistration.mockResolvedValue({
        year: 2026,
        month: 8,
        entries: [{ permno: 'AB123', availableDays: 31 }],
      })

      const [record] = await run()

      expect(record.dayRateEntryId).toBeUndefined()
    })

    it('resolves dayRateEntryId when exactly one day rate entry matches the permno', async () => {
      getDayRateEntries.mockResolvedValue([{ id: 42, fastnr: 'AB123' }])
      getPeriodRegistration.mockResolvedValue({
        year: 2026,
        month: 8,
        entries: [{ permno: 'AB123', availableDays: 31 }],
      })

      const [record] = await run()

      expect(record.dayRateEntryId).toBe(42)
    })

    it('leaves dayRateEntryId undefined when a permno has duplicate day rate entries', async () => {
      getDayRateEntries.mockResolvedValue([
        { id: 1, fastnr: 'SPLIT' },
        { id: 2, fastnr: 'SPLIT' },
      ])
      getPeriodRegistration.mockResolvedValue({
        year: 2026,
        month: 8,
        entries: [{ permno: 'SPLIT', availableDays: 20 }],
      })

      const [record] = await run()

      expect(record.permno).toBe('SPLIT')
      expect(record.dayRateEntryId).toBeUndefined()
    })

    it('reports a 404 from the period registry as a warning rather than a failure', async () => {
      getPeriodRegistration.mockRejectedValue(
        await FetchError.buildMock({ status: 404 }),
      )

      await expect(run()).rejects.toBeInstanceOf(TemplateApiError)
    })

    it('reports an empty period registration the same way as a 404', async () => {
      getPeriodRegistration.mockResolvedValue({
        year: 2026,
        month: 8,
        entries: [],
      })

      await expect(run()).rejects.toBeInstanceOf(TemplateApiError)
    })

    it('still fails loudly when the period registry errors for another reason', async () => {
      getPeriodRegistration.mockRejectedValue(
        await FetchError.buildMock({ status: 500 }),
      )

      await expect(run()).rejects.not.toBeInstanceOf(TemplateApiError)
    })

    it('does not fail the whole request when the day rate entries call 404s', async () => {
      getDayRateEntries.mockRejectedValue(
        await FetchError.buildMock({ status: 404 }),
      )
      getPeriodRegistration.mockResolvedValue({
        year: 2026,
        month: 8,
        entries: [{ permno: 'AB123', availableDays: 31 }],
      })

      const [record] = await run()

      expect(record.permno).toBe('AB123')
      expect(record.dayRateEntryId).toBeUndefined()
    })
  })
})
