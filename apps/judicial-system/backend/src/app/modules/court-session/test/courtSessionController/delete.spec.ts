import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseFileCategory } from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { runInRequestContext } from '../../../../test'
import { FileService } from '../../../file'
import {
  AppealCaseRepositoryService,
  Case,
  CaseFile,
  CourtDocumentRepositoryService,
  CourtSession,
  CourtSessionRepositoryService,
  CourtSessionStringRepositoryService,
} from '../../../repository'

interface Then {
  result: { deleted: boolean }
  error: Error
}

// Only the latest court session can be deleted, and it is emptied first - its
// documents return to the case, its strings go - before the row does. Deleting
// it also takes its account of the session's ruling with it. A ruling that was
// only ever pronounced orally there has nothing left holding it up, so it goes
// too - unlike one the district court has since written up.
describe('CourtSessionController - Delete', () => {
  const caseId = uuid()
  const courtSessionId = uuid()

  // Every ruling the specs build, as the database would hold it.
  const rulingOrdersById = new Map<string, CaseFile>()
  // The sessions the case under test has, as the database would hold them.
  let sessionsPronouncing: CourtSession[] = []

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let mockCourtDocumentRepositoryService: CourtDocumentRepositoryService
  let mockCourtSessionStringRepositoryService: CourtSessionStringRepositoryService
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
      courtDocumentRepositoryService,
      courtSessionStringRepositoryService,
      appealCaseRepositoryService,
      fileService,
      courtSessionController,
    } = await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    mockCourtDocumentRepositoryService = courtDocumentRepositoryService
    mockCourtSessionStringRepositoryService =
      courtSessionStringRepositoryService
    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockFileService = fileService
    // Which session is the latest is read from the transaction, so the stub
    // answers with the last of the sessions the test set up on the case.
    ;(
      mockCourtSessionRepositoryService.findLatestByCase as jest.Mock
    ).mockImplementation(
      async () => sessionsPronouncing[sessionsPronouncing.length - 1] ?? null,
    )
    // The cleanup reads the ruling from the transaction, so the stub resolves it
    // the way the database would.
    ;(mockFileService.findByIdOrNull as jest.Mock).mockImplementation(
      async (fileId: string) => rulingOrdersById.get(fileId) ?? null,
    )
    // Which sessions pronounce a ruling is read from the transaction too, so the
    // stub answers from the sessions the test set up on the case.
    ;(
      mockCourtSessionRepositoryService.findAllByRulingFileId as jest.Mock
    ).mockImplementation(async (_caseId: string, rulingFileId: string) =>
      sessionsPronouncing.filter(
        (session) => session.rulingFileId === rulingFileId,
      ),
    )

    givenWhenThen = async (theCase, courtSession) => {
      const then = {} as Then

      try {
        // The routes are guarded by CaseExistsForUpdateGuard, so the request
        // transaction is already open by the time the handler runs. Guards do
        // not execute in controller unit tests, so the request context is set
        // up here instead.
        await runInRequestContext(async () => {
          then.result = await courtSessionController.delete(
            caseId,
            courtSession.id,
            theCase,
            courtSession,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  afterEach(() => jest.clearAllMocks())

  const makeRulingOrder = (overrides: Partial<CaseFile> = {}): CaseFile => {
    const rulingOrder = {
      id: uuid(),
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      key: `${caseId}/${uuid()}/ruling.pdf`,
      ...overrides,
    } as CaseFile

    rulingOrdersById.set(rulingOrder.id, rulingOrder)

    return rulingOrder
  }

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

    sessionsPronouncing = (theCase.courtSessions ?? []) as CourtSession[]

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

    it('should check it is the latest session against the transaction', () => {
      expect(
        mockCourtSessionRepositoryService.findLatestByCase,
      ).toHaveBeenCalledWith(caseId, { transaction })
    })

    it('should empty the session before deleting it: documents, then strings, then the row', () => {
      const removeDocuments =
        mockCourtDocumentRepositoryService.removeAllCourtDocumentsFromCourtSession as jest.Mock
      const deleteStrings =
        mockCourtSessionStringRepositoryService.deleteAllForCourtSession as jest.Mock
      const deleteRow = mockCourtSessionRepositoryService.delete as jest.Mock

      expect(removeDocuments).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        transaction,
      )
      expect(deleteStrings).toHaveBeenCalledWith(caseId, courtSessionId, {
        transaction,
      })
      expect(removeDocuments.mock.invocationCallOrder[0]).toBeLessThan(
        deleteStrings.mock.invocationCallOrder[0],
      )
      expect(deleteStrings.mock.invocationCallOrder[0]).toBeLessThan(
        deleteRow.mock.invocationCallOrder[0],
      )
    })
  })

  // The controller's check, against the case the guard read under FOR UPDATE:
  // the row is locked for the request, so a session that is not the last one
  // here will not become it before the request commits. The service's own
  // re-check below is never reached.
  describe('session that is not the latest on the locked case', () => {
    const earlierCourtSession = { id: courtSessionId, caseId } as CourtSession
    const theCase = {
      id: caseId,
      caseFiles: [],
      courtSessions: [earlierCourtSession, { id: uuid(), caseId }],
      rulingOrderAppealCases: [],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, earlierCourtSession)
    })

    it('should refuse to delete the session', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Could not delete court session ${courtSessionId} of case ${caseId}. Only the latest court session can be deleted.`,
      )
    })

    it('should not reach the service', () => {
      expect(
        mockCourtSessionRepositoryService.findLatestByCase,
      ).not.toHaveBeenCalled()
      expect(mockCourtSessionRepositoryService.delete).not.toHaveBeenCalled()
    })
  })

  // The service's check against the same transaction's view of the case. The
  // controller already decided against the locked row, so this only fires for
  // a caller that passed a stale case.
  describe('session that is no longer the latest', () => {
    let then: Then

    beforeEach(async () => {
      ;(
        mockCourtSessionRepositoryService.findLatestByCase as jest.Mock
      ).mockResolvedValue({ id: uuid(), caseId } as CourtSession)

      then = await deleteSessionPronouncing()
    })

    it('should refuse to delete the session', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe(
        `Only the latest court session of case ${caseId} can be deleted`,
      )
    })

    it('should touch nothing', () => {
      expect(
        mockCourtDocumentRepositoryService.removeAllCourtDocumentsFromCourtSession,
      ).not.toHaveBeenCalled()
      expect(
        mockCourtSessionStringRepositoryService.deleteAllForCourtSession,
      ).not.toHaveBeenCalled()
      expect(mockCourtSessionRepositoryService.delete).not.toHaveBeenCalled()
    })
  })

  describe('case has no sessions in the transaction', () => {
    let then: Then

    beforeEach(async () => {
      ;(
        mockCourtSessionRepositoryService.findLatestByCase as jest.Mock
      ).mockResolvedValue(null)

      then = await deleteSessionPronouncing()
    })

    it('should refuse to delete the session', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe(
        `Could not find court session ${courtSessionId} of case ${caseId}`,
      )
      expect(mockCourtSessionRepositoryService.delete).not.toHaveBeenCalled()
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
      ;(
        mockAppealCaseRepositoryService.existsForRulingFile as jest.Mock
      ).mockResolvedValue(true)

      then = await deleteSessionPronouncing(appealedRuling)
    })

    it('should refuse to delete the session', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'The ruling order pronounced in this court session has been appealed, so the court session cannot be deleted',
      )
      expect(mockCourtSessionRepositoryService.delete).not.toHaveBeenCalled()
      expect(
        mockCourtDocumentRepositoryService.removeAllCourtDocumentsFromCourtSession,
      ).not.toHaveBeenCalled()
    })

    it('should check for an appeal of that ruling against the transaction', () => {
      expect(
        mockAppealCaseRepositoryService.existsForRulingFile,
      ).toHaveBeenCalledWith(caseId, appealedRuling.id, { transaction })
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
