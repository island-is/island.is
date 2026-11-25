import { v4 as uuid } from 'uuid'

import {
  CaseState,
  CaseType,
  EventType,
  ServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingStatisticsModule } from '../createTestingStatisticsModule'

import {
  Case,
  CaseRepositoryService,
  EventLog,
  SubpoenaRepositoryService,
} from '../../../repository'
import { CaseStatistics } from '../../models/caseStatistics.response'

interface Then {
  result: CaseStatistics
  error: Error
}

type GivenWhenThen = (
  fromDate?: Date,
  toDate?: Date,
  institutionId?: string,
) => Promise<Then>

const day = 24 * 60 * 60 * 1000

const indictmentConfirmedOn = (date: Date) =>
  [{ eventType: EventType.INDICTMENT_CONFIRMED, created: date }] as EventLog[]

describe('StatisticsController - Get statistics', () => {
  let mockCaseRepositoryService: jest.Mocked<CaseRepositoryService>
  let mockSubpoenaRepositoryService: jest.Mocked<SubpoenaRepositoryService>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      caseRepositoryService,
      subpoenaRepositoryService,
      statisticsController,
    } = await createTestingStatisticsModule()

    mockCaseRepositoryService = caseRepositoryService
    mockSubpoenaRepositoryService = subpoenaRepositoryService

    mockCaseRepositoryService.findCasesForStatistics.mockResolvedValue([])
    mockSubpoenaRepositoryService.findEarliestPoliceSubpoenaCreatedDate.mockResolvedValue(
      null,
    )
    mockSubpoenaRepositoryService.countPoliceSubpoenas.mockResolvedValue(0)
    mockSubpoenaRepositoryService.countPoliceSubpoenasByServiceStatus.mockResolvedValue(
      [],
    )

    givenWhenThen = async (
      fromDate?: Date,
      toDate?: Date,
      institutionId?: string,
    ) => {
      const then = {} as Then

      try {
        then.result = await statisticsController.getStatistics(
          fromDate,
          toDate,
          institutionId,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('filter plumbing', () => {
    const from = new Date('2026-01-01')
    const to = new Date('2026-06-30')
    const institutionId = uuid()

    it.each([
      ['all params', from, to, institutionId],
      ['only from', from, undefined, undefined],
      ['only to', undefined, to, undefined],
      ['only institution', undefined, undefined, institutionId],
      ['no params', undefined, undefined, undefined],
    ])(
      'should pass %s to every read as one typed filter',
      async (_, fromDate, toDate, institution) => {
        await givenWhenThen(fromDate, toDate, institution)

        const filter = {
          from: fromDate,
          to: toDate,
          institutionId: institution,
        }

        expect(
          mockCaseRepositoryService.findCasesForStatistics,
        ).toHaveBeenCalledWith(filter)
        expect(
          mockSubpoenaRepositoryService.countPoliceSubpoenas,
        ).toHaveBeenCalledWith(filter)
        expect(
          mockSubpoenaRepositoryService.countPoliceSubpoenasByServiceStatus,
        ).toHaveBeenCalledWith(filter)
      },
    )

    // The earliest date bounds the period the client may ask for, so it is
    // read without the filter.
    it('should read the earliest subpoena date without a filter', async () => {
      await givenWhenThen(from, to, institutionId)

      expect(
        mockSubpoenaRepositoryService.findEarliestPoliceSubpoenaCreatedDate,
      ).toHaveBeenCalledWith()
    })
  })

  describe('case statistics', () => {
    const confirmed = new Date('2026-03-01T00:00:00.000Z')
    let then: Then
    let before: number
    let after: number

    beforeEach(async () => {
      mockCaseRepositoryService.findCasesForStatistics.mockResolvedValueOnce([
        // Request cases: one in progress, two completed
        { id: uuid(), type: CaseType.CUSTODY, state: CaseState.RECEIVED },
        { id: uuid(), type: CaseType.TRAVEL_BAN, state: CaseState.ACCEPTED },
        {
          id: uuid(),
          type: CaseType.SEARCH_WARRANT,
          state: CaseState.DISMISSED,
        },
        // Indictments: ruled after 2 and 5 days, one ruled before it was
        // confirmed (not a duration), one in progress with no ruling, one
        // ruled with no confirmation (not a duration)
        {
          id: uuid(),
          type: CaseType.INDICTMENT,
          state: CaseState.COMPLETED,
          rulingDate: new Date(confirmed.getTime() + 2 * day),
          eventLogs: indictmentConfirmedOn(confirmed),
        },
        {
          id: uuid(),
          type: CaseType.INDICTMENT,
          state: CaseState.COMPLETED,
          rulingDate: new Date(confirmed.getTime() + 5 * day),
          eventLogs: indictmentConfirmedOn(confirmed),
        },
        {
          id: uuid(),
          type: CaseType.INDICTMENT,
          state: CaseState.COMPLETED,
          rulingDate: new Date(confirmed.getTime() - day),
          eventLogs: indictmentConfirmedOn(confirmed),
        },
        {
          id: uuid(),
          type: CaseType.INDICTMENT,
          state: CaseState.RECEIVED,
          rulingDate: null,
          eventLogs: indictmentConfirmedOn(confirmed),
        },
        {
          id: uuid(),
          type: CaseType.INDICTMENT,
          state: CaseState.COMPLETED,
          rulingDate: new Date(confirmed.getTime() + 30 * day),
          eventLogs: [],
        },
      ] as unknown as Case[])

      before = Date.now()
      then = await givenWhenThen()
      after = Date.now()
    })

    it('should count every case', () => {
      expect(then.result.count).toBe(8)
    })

    it('should split request cases from indictments', () => {
      expect(then.result.requestCases).toMatchObject({
        count: 3,
        inProgressCount: 1,
        completedCount: 2,
      })
      expect(then.result.indictmentCases).toMatchObject({
        count: 5,
        inProgressCount: 1,
        rulingCount: 4,
      })
    })

    it('should average ruling time over confirmed cases ruled after confirmation', () => {
      expect(then.result.indictmentCases.averageRulingTimeMs).toBe(3.5 * day)
      // Math.round(3.5) rounds up
      expect(then.result.indictmentCases.averageRulingTimeDays).toBe(4)
    })

    // Both case blocks report "now" as their earliest date, regardless of the
    // cases returned - only the subpoena block reads a real one.
    it('should set both case blocks minDate to now', () => {
      for (const block of [
        then.result.requestCases,
        then.result.indictmentCases,
      ]) {
        expect(block.minDate.getTime()).toBeGreaterThanOrEqual(before)
        expect(block.minDate.getTime()).toBeLessThanOrEqual(after)
      }
    })
  })

  describe('no indictment has a ruling duration', () => {
    let then: Then

    beforeEach(async () => {
      mockCaseRepositoryService.findCasesForStatistics.mockResolvedValueOnce([
        {
          id: uuid(),
          type: CaseType.INDICTMENT,
          state: CaseState.RECEIVED,
          rulingDate: null,
          eventLogs: [],
        },
      ] as unknown as Case[])

      then = await givenWhenThen()
    })

    it('should report a zero average', () => {
      expect(then.result.indictmentCases.averageRulingTimeMs).toBe(0)
      expect(then.result.indictmentCases.averageRulingTimeDays).toBe(0)
    })
  })

  describe('subpoena statistics', () => {
    const earliest = new Date('2025-02-03T00:00:00.000Z')
    let then: Then

    beforeEach(async () => {
      mockSubpoenaRepositoryService.findEarliestPoliceSubpoenaCreatedDate.mockResolvedValueOnce(
        earliest,
      )
      mockSubpoenaRepositoryService.countPoliceSubpoenas.mockResolvedValueOnce(
        7,
      )
      mockSubpoenaRepositoryService.countPoliceSubpoenasByServiceStatus.mockResolvedValueOnce(
        [
          {
            serviceStatus: ServiceStatus.ELECTRONICALLY,
            count: 4,
            averageServiceTimeMs: 138240000.4, // 1.6 days and a fraction
          },
          {
            serviceStatus: ServiceStatus.IN_PERSON,
            count: 2,
            averageServiceTimeMs: 120960000, // 1.4 days
          },
          // No served subpoena in the group, so the database average is null
          { serviceStatus: null, count: 1, averageServiceTimeMs: null },
        ],
      )

      then = await givenWhenThen()
    })

    it('should return the count and earliest date', () => {
      expect(then.result.subpoenas.count).toBe(7)
      expect(then.result.subpoenas.minDate).toBe(earliest)
    })

    it('should round the average to whole milliseconds and whole days', () => {
      expect(then.result.subpoenas.serviceStatusStatistics).toEqual([
        {
          serviceStatus: ServiceStatus.ELECTRONICALLY,
          count: 4,
          averageServiceTimeMs: 138240000,
          averageServiceTimeDays: 2,
        },
        {
          serviceStatus: ServiceStatus.IN_PERSON,
          count: 2,
          averageServiceTimeMs: 120960000,
          averageServiceTimeDays: 1,
        },
        {
          serviceStatus: null,
          count: 1,
          averageServiceTimeMs: 0,
          averageServiceTimeDays: 0,
        },
      ])
    })
  })

  describe('no police subpoena exists', () => {
    let then: Then
    let before: number
    let after: number

    beforeEach(async () => {
      before = Date.now()
      then = await givenWhenThen()
      after = Date.now()
    })

    it('should default minDate to now', () => {
      const minDate = then.result.subpoenas.minDate.getTime()

      expect(minDate).toBeGreaterThanOrEqual(before)
      expect(minDate).toBeLessThanOrEqual(after)
    })
  })

  describe('case read fails', () => {
    const error = new Error('Some error')
    let then: Then

    beforeEach(async () => {
      mockCaseRepositoryService.findCasesForStatistics.mockRejectedValueOnce(
        error,
      )

      then = await givenWhenThen()
    })

    it('should throw', () => {
      expect(then.error).toBe(error)
    })
  })
})
