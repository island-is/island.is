import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

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

  describe('session pronouncing an appealed ruling orally', () => {
    const pronouncedOrally = makeRulingOrder({
      isPronouncedOrally: true,
      key: '',
    })

    beforeEach(async () => {
      ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
        [
          {
            id: uuid(),
            rulingFileId: pronouncedOrally.id,
            appealState: AppealCaseState.APPEALED,
          } as AppealCase,
        ],
      )

      await deleteSessionPronouncing(pronouncedOrally)
    })

    // The appeal keeps pointing at the ruling it was filed against, and nothing
    // cascades from the deleted session, so the appeal, its decisions and the
    // party files all survive - and the ruling can be pronounced in another
    // session to bring them back into view.
    it('should keep the ruling the appeal keys on', () => {
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
