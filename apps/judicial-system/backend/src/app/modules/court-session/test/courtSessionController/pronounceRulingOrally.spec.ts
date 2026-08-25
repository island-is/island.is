import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseState,
  CaseFileCategory,
  CourtSessionRulingType,
  User,
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

jest.mock('@island.is/judicial-system/message', () => ({
  ...jest.requireActual('@island.is/judicial-system/message'),
  addMessagesToQueue: jest.fn(),
}))

interface Then {
  result: CourtSession | null
  error: Error
}

// A ruling order is usually pronounced orally in the session and only written up
// if a party appeals it. Pronouncing one creates the ruling's case file with no
// document behind it and links the session to it, going through the same update
// path as any other ruling order so that swapping to and from it follows the
// existing rules.
describe('CourtSessionController - Pronounce ruling orally', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const courtCaseNumber = 'S-123/2026'
  const startDate = new Date('2026-11-12T10:00:00Z')
  const user = { id: uuid(), name: 'Dómarinn' } as User

  const createdRulingFileId = uuid()

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
      appealDecisionRepositoryService,
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

    // The swap target is clean of recorded decisions.
    ;(appealDecisionRepositoryService.findAll as jest.Mock).mockResolvedValue(
      [],
    )
    ;(
      mockFileService.createRulingOrderPronouncedOrally as jest.Mock
    ).mockImplementation(async (_theCase, name) =>
      makeRulingOrder({
        id: createdRulingFileId,
        name,
        userGeneratedFilename: name,
        isPronouncedOrally: true,
        key: '',
      }),
    )
    ;(mockCourtSessionRepositoryService.update as jest.Mock).mockImplementation(
      async (_caseId, _courtSessionId, update) => ({
        id: courtSessionId,
        caseId,
        isConfirmed: false,
        ...update,
      }),
    )

    givenWhenThen = async (theCase, courtSession) => {
      const then = {} as Then

      try {
        then.result = await courtSessionController.pronounceRulingOrally(
          caseId,
          courtSessionId,
          user,
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

  const makeCase = (overrides: Partial<Case> = {}): Case =>
    ({
      id: caseId,
      courtCaseNumber,
      caseFiles: [],
      courtSessions: [],
      rulingOrderAppealCases: [],
      ...overrides,
    } as unknown as Case)

  const makeCourtSession = (
    overrides: Partial<CourtSession> = {},
  ): CourtSession =>
    ({
      id: courtSessionId,
      caseId,
      startDate,
      isConfirmed: false,
      ...overrides,
    } as CourtSession)

  describe('pronouncing a ruling in a session with no ruling', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(makeCase(), makeCourtSession())
    })

    it('should create the ruling with the name it was given when pronounced', () => {
      expect(
        mockFileService.createRulingOrderPronouncedOrally,
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: caseId }),
        `${courtCaseNumber} Úrskurður 12.11.2026`,
        user,
        transaction,
      )
    })

    it('should pronounce the ruling in the court record', () => {
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        {
          rulingType: CourtSessionRulingType.ORDER,
          rulingFileId: createdRulingFileId,
        },
        { transaction },
      )
      expect(then.result?.rulingFileId).toBe(createdRulingFileId)
    })

    it('should not delete anything', () => {
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })
  })

  describe('pronouncing a ruling in a confirmed session', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        makeCase(),
        makeCourtSession({ isConfirmed: true }),
      )
    })

    it('should be rejected without creating a ruling', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'A ruling cannot be pronounced in a confirmed court session',
      )
      expect(
        mockFileService.createRulingOrderPronouncedOrally,
      ).not.toHaveBeenCalled()
    })
  })

  describe('pronouncing a ruling in a session that pronounced an uploaded one', () => {
    const uploadedRulingOrder = makeRulingOrder()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        makeCase({
          caseFiles: [uploadedRulingOrder],
          courtSessions: [
            makeCourtSession({ rulingFileId: uploadedRulingOrder.id }),
          ],
        }),
        makeCourtSession({
          rulingType: CourtSessionRulingType.ORDER,
          rulingFileId: uploadedRulingOrder.id,
        }),
      )
    })

    it('should swap the court record onto the ruling pronounced orally', () => {
      expect(then.error).toBeUndefined()
      expect(then.result?.rulingFileId).toBe(createdRulingFileId)
    })

    it('should keep the uploaded ruling, which is a document of its own', () => {
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })
  })

  describe('swapping away from a ruling pronounced orally', () => {
    const pronouncedOrally = makeRulingOrder({
      isPronouncedOrally: true,
      key: '',
    })

    const swapAwayFrom = (theCase: Case) =>
      givenWhenThen(
        theCase,
        makeCourtSession({
          rulingType: CourtSessionRulingType.ORDER,
          rulingFileId: pronouncedOrally.id,
        }),
      )

    const caseStillPronouncing = (overrides: Partial<Case> = {}) =>
      makeCase({
        caseFiles: [pronouncedOrally],
        courtSessions: [
          makeCourtSession({ rulingFileId: pronouncedOrally.id }),
        ],
        ...overrides,
      })

    it('should delete the ruling nothing refers to any more', async () => {
      await swapAwayFrom(caseStillPronouncing())

      expect(mockFileService.deleteCaseFile).toHaveBeenCalledWith(
        expect.objectContaining({ id: caseId }),
        pronouncedOrally,
        transaction,
      )
    })

    it('should keep a ruling that has been written up', async () => {
      const writtenUp = makeRulingOrder({ isPronouncedOrally: true })

      await givenWhenThen(
        makeCase({
          caseFiles: [writtenUp],
          courtSessions: [makeCourtSession({ rulingFileId: writtenUp.id })],
        }),
        makeCourtSession({
          rulingType: CourtSessionRulingType.ORDER,
          rulingFileId: writtenUp.id,
        }),
      )

      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })

    it('should keep a ruling another session still pronounces', async () => {
      await swapAwayFrom(
        caseStillPronouncing({
          courtSessions: [
            makeCourtSession({ rulingFileId: pronouncedOrally.id }),
            makeCourtSession({
              id: uuid(),
              rulingFileId: pronouncedOrally.id,
            }),
          ],
        }),
      )

      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })

    it('should keep a ruling an appeal still keys on', async () => {
      ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
        [
          {
            id: uuid(),
            rulingFileId: pronouncedOrally.id,
            appealState: AppealCaseState.APPEALED,
          } as AppealCase,
        ],
      )

      await swapAwayFrom(caseStillPronouncing())

      expect(mockAppealCaseRepositoryService.findAll).toHaveBeenCalledWith({
        where: { caseId, rulingFileId: pronouncedOrally.id },
        transaction,
      })
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
    })
  })
})
