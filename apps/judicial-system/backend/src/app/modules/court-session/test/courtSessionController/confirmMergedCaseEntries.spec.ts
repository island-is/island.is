import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { CourtSessionStringType } from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import {
  Case,
  CourtDocument,
  CourtSession,
  CourtSessionRepositoryService,
  CourtSessionString,
} from '../../../repository'
import { UpdateCourtSessionDto } from '../../dto/updateCourtSession.dto'

jest.mock('@island.is/judicial-system/message', () => ({
  ...jest.requireActual('@island.is/judicial-system/message'),
  addMessagesToQueue: jest.fn(),
}))

interface Then {
  result: CourtSession | null
  error: Error
}

type GivenWhenThen = (
  courtSessionToUpdate: UpdateCourtSessionDto,
) => Promise<Then>

// A merged case's entries are the court's record of why the cases were joined,
// so a session cannot be confirmed while any of them is blank. The web client
// disables the confirm button on the same rule; this is the server side of it.
describe('CourtSessionController - Confirm with merged case entries', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const mergedCaseId = uuid()
  const otherMergedCaseId = uuid()

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let givenWhenThen: GivenWhenThen

  let existingCourtSession: {
    id: string
    isConfirmed: boolean | undefined
    mergedFiledDocuments?: Partial<CourtDocument>[]
    courtSessionStrings?: Partial<CourtSessionString>[]
  }

  const entries = (mergedCaseId: string, value: string) => ({
    mergedCaseId,
    value,
    stringType: CourtSessionStringType.ENTRIES,
  })

  beforeEach(async () => {
    const { sequelize, courtSessionRepositoryService, courtSessionController } =
      await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn({} as Transaction),
    )

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue({ id: courtSessionId, caseId })

    existingCourtSession = { id: courtSessionId, isConfirmed: false }

    givenWhenThen = async (courtSessionToUpdate: UpdateCourtSessionDto) => {
      const then = {} as Then
      const theCase = { id: caseId, caseFiles: [] } as unknown as Case

      try {
        then.result = await courtSessionController.update(
          caseId,
          courtSessionId,
          courtSessionToUpdate,
          {} as never,
          theCase,
          existingCourtSession as unknown as CourtSession,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('a merged case with no entries at all', () => {
    let then: Then

    beforeEach(async () => {
      existingCourtSession.mergedFiledDocuments = [{ caseId: mergedCaseId }]

      then = await givenWhenThen({ isConfirmed: true })
    })

    it('should reject the confirmation', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Merged case ${mergedCaseId} must have entries before the court session can be confirmed`,
      )
    })

    it('should not write the court session', () => {
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('a merged case with blank entries', () => {
    let then: Then

    beforeEach(async () => {
      existingCourtSession.mergedFiledDocuments = [{ caseId: mergedCaseId }]
      existingCourtSession.courtSessionStrings = [entries(mergedCaseId, '   ')]

      then = await givenWhenThen({ isConfirmed: true })
    })

    it('should reject the confirmation', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
    })
  })

  describe('one of two merged cases missing entries', () => {
    let then: Then

    beforeEach(async () => {
      existingCourtSession.mergedFiledDocuments = [
        { caseId: mergedCaseId },
        { caseId: otherMergedCaseId },
      ]
      existingCourtSession.courtSessionStrings = [
        entries(mergedCaseId, 'Málin sameinuð'),
      ]

      then = await givenWhenThen({ isConfirmed: true })
    })

    it('should reject the confirmation naming the missing case', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Merged case ${otherMergedCaseId} must have entries before the court session can be confirmed`,
      )
    })
  })

  describe('every merged case has entries', () => {
    let then: Then

    beforeEach(async () => {
      existingCourtSession.mergedFiledDocuments = [
        { caseId: mergedCaseId },
        { caseId: otherMergedCaseId },
      ]
      existingCourtSession.courtSessionStrings = [
        entries(mergedCaseId, 'Málin sameinuð'),
        entries(otherMergedCaseId, 'Málin sameinuð'),
      ]

      then = await givenWhenThen({ isConfirmed: true })
    })

    it('should confirm the court session', () => {
      expect(then.error).toBeUndefined()
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalled()
    })
  })

  describe('a session with no merged documents', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({ isConfirmed: true })
    })

    it('should confirm the court session', () => {
      expect(then.error).toBeUndefined()
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalled()
    })
  })

  describe('an update that does not confirm', () => {
    let then: Then

    beforeEach(async () => {
      existingCourtSession.mergedFiledDocuments = [{ caseId: mergedCaseId }]

      then = await givenWhenThen({ location: 'Updated Location' })
    })

    it('should not be blocked by missing entries', () => {
      expect(then.error).toBeUndefined()
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalled()
    })
  })

  describe('a session that is already confirmed', () => {
    let then: Then

    beforeEach(async () => {
      existingCourtSession.isConfirmed = true
      existingCourtSession.mergedFiledDocuments = [{ caseId: mergedCaseId }]

      then = await givenWhenThen({ isConfirmed: true })
    })

    it('should not re-run the check', () => {
      expect(then.error).toBeUndefined()
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalled()
    })
  })
})
