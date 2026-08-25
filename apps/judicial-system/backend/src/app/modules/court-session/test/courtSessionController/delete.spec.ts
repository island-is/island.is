import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseState,
  CaseFileCategory,
} from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { FileService } from '../../../file'
import {
  AppealCase,
  AppealCaseRepositoryService,
  Case,
  CaseFile,
  CourtSession,
  CourtSessionRepositoryService,
} from '../../../repository'

interface Then {
  result: { deleted: boolean }
  error: Error
}

// Deleting a court session takes its account of the session's ruling with it. A
// ruling that was only ever pronounced orally there has nothing left holding it
// up, so it goes too - unlike one the district court has since written up.
describe('CourtSessionController - Delete', () => {
  const caseId = uuid()
  const courtSessionId = uuid()

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockFileService: FileService
  let transaction: Transaction
  let givenWhenThen: (
    theCase: Case,
    courtSession: CourtSession,
  ) => Promise<Then>

  beforeEach(async () => {
    const {
      sequelize,
      courtSessionRepositoryService,
      appealCaseRepositoryService,
      fileService,
      courtSessionController,
    } = await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockFileService = fileService

    givenWhenThen = async (theCase, courtSession) => {
      const then = {} as Then

      try {
        then.result = await courtSessionController.delete(
          caseId,
          courtSession.id,
          theCase,
          courtSession,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  afterEach(() => jest.clearAllMocks())

  const makeRulingOrder = (overrides: Partial<CaseFile> = {}): CaseFile =>
    ({
      id: uuid(),
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      key: `${caseId}/${uuid()}/ruling.pdf`,
      ...overrides,
    } as CaseFile)

  const deleteSessionPronouncing = (rulingFile?: CaseFile) => {
    const courtSession = {
      id: courtSessionId,
      caseId,
      rulingFileId: rulingFile?.id,
    } as CourtSession

    const theCase = {
      id: caseId,
      caseFiles: rulingFile ? [rulingFile] : [],
      courtSessions: [{ id: uuid() } as CourtSession, courtSession],
      rulingOrderAppealCases: [],
    } as unknown as Case

    return givenWhenThen(theCase, courtSession)
  }

  describe('session pronouncing a ruling orally', () => {
    const pronouncedOrally = makeRulingOrder({
      isPronouncedOrally: true,
      key: '',
    })
    let then: Then

    beforeEach(async () => {
      then = await deleteSessionPronouncing(pronouncedOrally)
    })

    it('should delete the session', () => {
      expect(mockCourtSessionRepositoryService.delete).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        { transaction },
      )
      expect(then.result).toEqual({ deleted: true })
    })

    it('should delete the ruling nothing refers to any more', () => {
      expect(mockFileService.deleteCaseFile).toHaveBeenCalledWith(
        expect.objectContaining({ id: caseId }),
        pronouncedOrally,
        transaction,
      )
    })
  })

  // Deleting the session would leave the appeal pointing at a ruling no court
  // record says was pronounced, hiding it from the parties who appealed it, so
  // the deletion is refused outright - for a written ruling as much as an oral
  // one. Without this the ruling would be stranded: kept alive by its appeal but
  // impossible to pronounce again.
  describe.each([
    ['pronounced orally', { isPronouncedOrally: true, key: '' }],
    ['uploaded', {}],
  ])('session pronouncing an appealed ruling %s', (_name, overrides) => {
    const appealedRuling = makeRulingOrder(overrides)
    let then: Then

    beforeEach(async () => {
      ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
        [
          {
            id: uuid(),
            rulingFileId: appealedRuling.id,
            appealState: AppealCaseState.APPEALED,
          } as AppealCase,
        ],
      )

      then = await deleteSessionPronouncing(appealedRuling)
    })

    it('should refuse to delete the session', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'The ruling order pronounced in this court session has been appealed, so the court session cannot be deleted',
      )
      expect(mockCourtSessionRepositoryService.delete).not.toHaveBeenCalled()
    })

    it('should leave the ruling alone', () => {
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })
  })

  describe('session pronouncing a ruling that has been written up', () => {
    beforeEach(async () => {
      await deleteSessionPronouncing(
        makeRulingOrder({ isPronouncedOrally: true }),
      )
    })

    it('should keep the ruling, which is a document of its own', () => {
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })
  })

  describe('session pronouncing an uploaded ruling', () => {
    beforeEach(async () => {
      await deleteSessionPronouncing(makeRulingOrder())
    })

    it('should keep the ruling', () => {
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })
  })

  describe('session with no ruling', () => {
    let then: Then

    beforeEach(async () => {
      then = await deleteSessionPronouncing()
    })

    it('should delete the session and nothing else', () => {
      expect(then.result).toEqual({ deleted: true })
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })
  })
})
