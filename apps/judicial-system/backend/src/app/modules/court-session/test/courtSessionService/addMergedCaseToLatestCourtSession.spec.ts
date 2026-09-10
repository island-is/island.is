import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { InternalServerErrorException } from '@nestjs/common'

import {
  CourtSessionStringType,
  EventType,
} from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import {
  Case,
  CaseRepositoryService,
  CourtDocumentRepositoryService,
  CourtSession,
  CourtSessionRepositoryService,
  CourtSessionStringRepositoryService,
  EventLogRepositoryService,
} from '../../../repository'

interface Then {
  result: CourtSession
  error: Error
}

type GivenWhenThen = () => Promise<Then>

// Reached from CaseService.update when an indictment case completes by merging
// into a parent case whose latest court session is still open: the merged
// case joins that session. A confirmed session's record is final, so the merge
// must not reach back into it.
describe('CourtSessionService - Add merged case to latest court session', () => {
  const caseId = uuid()
  const mergedCaseId = uuid()
  const courtSessionId = uuid()
  const transaction = {} as Transaction
  const mergedCase = { id: mergedCaseId, courtCaseNumber: 'S-9/2026' } as Case

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let mockCourtDocumentRepositoryService: CourtDocumentRepositoryService
  let mockEventLogRepositoryService: EventLogRepositoryService
  let mockCourtSessionStringRepositoryService: CourtSessionStringRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      courtSessionRepositoryService,
      caseRepositoryService,
      courtDocumentRepositoryService,
      eventLogRepositoryService,
      courtSessionStringRepositoryService,
      courtSessionService,
    } = await createTestingCourtSessionModule()

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    mockCaseRepositoryService = caseRepositoryService
    mockCourtDocumentRepositoryService = courtDocumentRepositoryService
    mockEventLogRepositoryService = eventLogRepositoryService
    mockCourtSessionStringRepositoryService =
      courtSessionStringRepositoryService

    const mockFindLatestByCase =
      mockCourtSessionRepositoryService.findLatestByCase as jest.Mock
    mockFindLatestByCase.mockResolvedValue({
      id: courtSessionId,
      isConfirmed: false,
    } as CourtSession)
    const mockFindById = mockCaseRepositoryService.findById as jest.Mock
    mockFindById.mockResolvedValue(mergedCase)
    const mockUpdateMergedCourtDocuments =
      mockCourtDocumentRepositoryService.updateMergedCourtDocuments as jest.Mock
    mockUpdateMergedCourtDocuments.mockResolvedValue(true)
    const mockFindLatestForCaseAndTypes =
      mockEventLogRepositoryService.findLatestForCaseAndTypes as jest.Mock
    mockFindLatestForCaseAndTypes.mockResolvedValue(null)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result =
          await courtSessionService.addMergedCaseToLatestCourtSession(
            caseId,
            mergedCaseId,
            transaction,
          )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('latest court session is open', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should read the latest session and the merged case in the transaction', () => {
      expect(
        mockCourtSessionRepositoryService.findLatestByCase,
      ).toHaveBeenCalledWith(caseId, { transaction })
      expect(mockCaseRepositoryService.findById).toHaveBeenCalledWith(
        mergedCaseId,
        { transaction },
      )
    })

    it('should file the merged case documents into the latest session', () => {
      expect(
        mockCourtDocumentRepositoryService.updateMergedCourtDocuments,
      ).toHaveBeenCalledWith({
        parentCaseId: caseId,
        parentCaseCourtSessionId: courtSessionId,
        caseId: mergedCaseId,
        transaction,
      })
    })

    it('should record the merged case in the entries of the session', () => {
      expect(
        mockEventLogRepositoryService.findLatestForCaseAndTypes,
      ).toHaveBeenCalledWith(
        mergedCaseId,
        [EventType.CASE_SENT_TO_COURT, EventType.INDICTMENT_CONFIRMED],
        { transaction },
      )
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          caseId,
          courtSessionId,
          mergedCaseId,
          stringType: CourtSessionStringType.ENTRIES,
          value: expect.stringContaining('Mál nr. S-9/2026'),
        }),
        { transaction },
      )
    })

    it('should return the latest session', () => {
      expect(then.result).toEqual({ id: courtSessionId, isConfirmed: false })
    })
  })

  describe('merged case has no documents left to file', () => {
    beforeEach(async () => {
      const mockUpdateMergedCourtDocuments =
        mockCourtDocumentRepositoryService.updateMergedCourtDocuments as jest.Mock
      mockUpdateMergedCourtDocuments.mockResolvedValue(false)

      await givenWhenThen()
    })

    it('should not add entries for it', () => {
      expect(
        mockEventLogRepositoryService.findLatestForCaseAndTypes,
      ).not.toHaveBeenCalled()
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).not.toHaveBeenCalled()
    })
  })

  describe.each([
    ['is confirmed', { id: courtSessionId, isConfirmed: true }],
    ['does not exist', null],
  ])('latest court session %s', (_name, latestCourtSession) => {
    let then: Then

    beforeEach(async () => {
      const mockFindLatestByCase =
        mockCourtSessionRepositoryService.findLatestByCase as jest.Mock
      mockFindLatestByCase.mockResolvedValue(latestCourtSession)

      then = await givenWhenThen()
    })

    it('should refuse the merge', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe(
        `The latest court session of case ${caseId} must not be confirmed when adding merged case ${mergedCaseId}`,
      )
    })

    it('should touch nothing', () => {
      expect(mockCaseRepositoryService.findById).not.toHaveBeenCalled()
      expect(
        mockCourtDocumentRepositoryService.updateMergedCourtDocuments,
      ).not.toHaveBeenCalled()
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).not.toHaveBeenCalled()
    })
  })

  describe('merged case does not exist', () => {
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockCaseRepositoryService.findById as jest.Mock
      mockFindById.mockResolvedValue(null)

      then = await givenWhenThen()
    })

    it('should refuse the merge', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe(
        `Could not find case ${mergedCaseId} when adding it as a merged case to the latest court session of case ${caseId}`,
      )
      expect(
        mockCourtDocumentRepositoryService.updateMergedCourtDocuments,
      ).not.toHaveBeenCalled()
    })
  })
})
