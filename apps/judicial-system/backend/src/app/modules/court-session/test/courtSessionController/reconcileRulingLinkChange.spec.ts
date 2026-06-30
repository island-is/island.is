import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseState,
  CaseFileCategory,
  CourtSessionRulingType,
  EventType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { EventLogService } from '../../../event-log'
import { FileService } from '../../../file'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CourtSession,
  CourtSessionRepositoryService,
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

// When a confirmed ORDER session is corrected to point at a different ruling
// order file, the same ruling is now represented by a new file: the recorded
// decisions, the appeal case and any appeal party files are re-pointed onto it
// so the in-court appeal carries over. When the ruling is removed altogether
// (the ruling type moves away from ORDER) there is no file to carry it onto, so
// a still-APPEALED appeal is deleted and a progressed one is rejected.
describe('CourtSessionController - Reconcile ruling link change', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const previousRulingFileId = uuid()
  const newRulingFileId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const user = { id: uuid() } as User

  const appealBrief = {
    id: uuid(),
    rulingFileId: previousRulingFileId,
    category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
  }
  const appealStatement = {
    id: uuid(),
    rulingFileId: previousRulingFileId,
    category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  }
  const previousRulingOrderFile = {
    id: previousRulingFileId,
    rulingFileId: null,
    category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
  }
  const newRulingOrderFile = {
    id: newRulingFileId,
    rulingFileId: null,
    category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
  }

  const caseWith = (options: {
    appealState?: AppealCaseState
    appealFiles?: boolean
  }): Case =>
    ({
      id: caseId,
      caseFiles: [
        previousRulingOrderFile,
        newRulingOrderFile,
        ...(options.appealFiles ? [appealBrief, appealStatement] : []),
      ],
      defendants: [{ id: defendantId }],
      civilClaimants: [],
      rulingOrderAppealCases: options.appealState
        ? [
            {
              id: appealCaseId,
              rulingFileId: previousRulingFileId,
              appealState: options.appealState,
            },
          ]
        : [],
    } as unknown as Case)

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockFileService: FileService
  let mockEventLogService: EventLogService
  let transaction: Transaction
  let givenWhenThen: (
    theCase: Case,
    update: UpdateCourtSessionDto,
    updatedSession: Partial<CourtSession>,
  ) => Promise<Then>

  beforeEach(async () => {
    const {
      sequelize,
      courtSessionRepositoryService,
      appealDecisionRepositoryService,
      appealCaseRepositoryService,
      appealEventLogRepositoryService,
      fileService,
      eventLogService,
      courtSessionController,
    } = await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockFileService = fileService
    mockEventLogService = eventLogService

    givenWhenThen = async (theCase, update, updatedSession) => {
      const then = {} as Then

      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValue({
        id: courtSessionId,
        caseId,
        isConfirmed: false,
        ...updatedSession,
      })

      const existingCourtSession = {
        id: courtSessionId,
        isConfirmed: false,
        rulingType: CourtSessionRulingType.ORDER,
        rulingFileId: previousRulingFileId,
      } as unknown as CourtSession

      try {
        then.result = await courtSessionController.update(
          caseId,
          courtSessionId,
          update,
          user,
          theCase,
          existingCourtSession,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  afterEach(() => jest.clearAllMocks())

  const swapTo = (appealState: AppealCaseState) =>
    givenWhenThen(
      caseWith({ appealState, appealFiles: true }),
      { rulingFileId: newRulingFileId } as UpdateCourtSessionDto,
      {
        rulingType: CourtSessionRulingType.ORDER,
        rulingFileId: newRulingFileId,
      },
    )

  describe('swapping the ruling file of a still-APPEALED appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await swapTo(AppealCaseState.APPEALED)
    })

    it('should write the session', () => {
      expect(then.error).toBeUndefined()
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalled()
    })

    it('should re-point the decisions onto the new ruling file', () => {
      expect(
        mockAppealDecisionRepositoryService.updateRulingFile,
      ).toHaveBeenCalledWith(caseId, previousRulingFileId, newRulingFileId, {
        transaction,
      })
    })

    it('should re-point the appeal case onto the new ruling file', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { rulingFileId: newRulingFileId },
        { transaction },
      )
    })

    it('should re-point the appeal party files onto the new ruling file', () => {
      expect(mockFileService.updateCaseFile).toHaveBeenCalledTimes(2)
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        appealBrief.id,
        { rulingFileId: newRulingFileId },
        transaction,
      )
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        appealStatement.id,
        { rulingFileId: newRulingFileId },
        transaction,
      )
    })

    it('should not delete anything', () => {
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
      expect(mockFileService.deleteCaseFile).not.toHaveBeenCalled()
      expect(
        mockAppealEventLogRepositoryService.deleteByAppealCaseId,
      ).not.toHaveBeenCalled()
      expect(mockEventLogService.createWithUser).not.toHaveBeenCalledWith(
        EventType.APPEAL_DELETED,
        caseId,
        user,
        transaction,
      )
    })
  })

  describe('swapping the ruling file of a progressed appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await swapTo(AppealCaseState.RECEIVED)
    })

    it('should be allowed and re-point the appeal onto the new file', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { rulingFileId: newRulingFileId },
        { transaction },
      )
      expect(
        mockAppealDecisionRepositoryService.updateRulingFile,
      ).toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
    })
  })

  describe('swapping the ruling file of a never-appealed ruling', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        caseWith({ appealFiles: false }),
        { rulingFileId: newRulingFileId } as UpdateCourtSessionDto,
        {
          rulingType: CourtSessionRulingType.ORDER,
          rulingFileId: newRulingFileId,
        },
      )
    })

    it('should re-point the decisions but touch no appeal case or files', () => {
      expect(then.error).toBeUndefined()
      expect(
        mockAppealDecisionRepositoryService.updateRulingFile,
      ).toHaveBeenCalledWith(caseId, previousRulingFileId, newRulingFileId, {
        transaction,
      })
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
      expect(mockFileService.updateCaseFile).not.toHaveBeenCalled()
    })
  })

  describe('removing the ruling (ORDER -> NONE) of a still-APPEALED appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        caseWith({ appealState: AppealCaseState.APPEALED, appealFiles: true }),
        { rulingType: CourtSessionRulingType.NONE } as UpdateCourtSessionDto,
        { rulingType: CourtSessionRulingType.NONE, rulingFileId: null },
      )
    })

    it('should delete the appeal case and audit it', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.delete).toHaveBeenCalledWith(
        appealCaseId,
        { transaction },
      )
      expect(mockEventLogService.createWithUser).toHaveBeenCalledWith(
        EventType.APPEAL_DELETED,
        caseId,
        user,
        transaction,
      )
    })

    it('should not re-point anything (no file to carry the appeal onto)', () => {
      expect(
        mockAppealDecisionRepositoryService.updateRulingFile,
      ).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('removing the ruling (ORDER -> NONE) of a progressed appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        caseWith({ appealState: AppealCaseState.RECEIVED, appealFiles: true }),
        { rulingType: CourtSessionRulingType.NONE } as UpdateCourtSessionDto,
        { rulingType: CourtSessionRulingType.NONE, rulingFileId: null },
      )
    })

    it('should reject the change and not write the session', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })

    it('should not delete or re-point anything', () => {
      expect(mockAppealCaseRepositoryService.delete).not.toHaveBeenCalled()
      expect(
        mockAppealDecisionRepositoryService.updateRulingFile,
      ).not.toHaveBeenCalled()
    })
  })
})
