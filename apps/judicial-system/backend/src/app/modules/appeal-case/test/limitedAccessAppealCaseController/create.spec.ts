import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseState,
  AppealCaseType,
  AppealEventType,
  AppealOrigin,
  CaseFileCategory,
  CaseFileState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import { queueMessagesAfterCommit } from '../../../../middleware'
import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
} from '../../../repository'
import { CreateAppealCaseDto } from '../../dto/createAppealCase.dto'

jest.mock('../../../../middleware/queueMessagesAfterCommit')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (theCase: Case, dto?: CreateAppealCaseDto) => Promise<Then>

describe('LimitedAccessAppealCaseController - Create', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defenderNationalId = '1111111111'

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
  } as User

  const createdAppealCase = { id: appealCaseId, caseId } as AppealCase

  const now = new Date('2024-01-15T10:00:00Z')

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      limitedAccessAppealCaseController,
      appealCaseRepositoryService,
      appealDecisionRepositoryService,
      appealEventLogRepositoryService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockCreate = mockAppealCaseRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue(createdAppealCase)

    givenWhenThen = async (theCase, dto = {}) => {
      const then = {} as Then

      await limitedAccessAppealCaseController
        .create(caseId, defender, theCase, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defence user appeals a restriction case', () => {
    const defendantId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      caseFiles: [],
      defendants: [{ id: defendantId }],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase)
    })

    it('should create an appealed appeal case', () => {
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          appealType: AppealCaseType.RULING,
          appealState: AppealCaseState.APPEALED,
          appealDate: now,
        },
        { transaction },
      )
      expect(then.result).toBe(createdAppealCase)
    })

    it('should not touch appeal_decision rows for an out-of-court appeal', () => {
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })

    it('should record an APPEALED event for the defence side (no user id)', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.OUT_OF_COURT,
          userRole: UserRole.DEFENDER,
          userId: undefined,
          nationalId: defender.nationalId,
          userName: defender.name,
          userTitle: defender.title,
          institutionName: defender.institution?.name,
        },
        { transaction },
      )
    })

    it('should queue the appeal to court of appeals notification', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          body: { type: AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
        }),
      )
    })
  })

  describe('defence user appeals a ruling order on an indictment case', () => {
    const rulingFileId = uuid()
    const briefFileId = uuid()
    const defendantId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: 'RECEIVED',
      caseFiles: [
        {
          id: rulingFileId,
          category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        },
        {
          id: briefFileId,
          rulingFileId,
          state: CaseFileState.STORED_IN_RVG,
          isKeyAccessible: true,
          category: CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        },
        {
          id: uuid(),
          rulingFileId: uuid(),
          state: CaseFileState.STORED_IN_RVG,
          isKeyAccessible: true,
          category: CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        },
      ],
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId,
        },
      ],
    } as unknown as Case
    const createdRulingOrderAppeal = {
      ...createdAppealCase,
      rulingFileId,
    } as AppealCase
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockAppealCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValue(createdRulingOrderAppeal)

      then = await givenWhenThen(theCase, { rulingFileId })
    })

    it('should create a ruling-order appeal', () => {
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          appealType: AppealCaseType.RULING,
          appealState: AppealCaseState.APPEALED,
          rulingFileId,
          appealDate: now,
        },
        { transaction },
      )
      expect(then.result).toBe(createdRulingOrderAppeal)
    })

    it('should not touch appeal_decision rows for an out-of-court appeal', () => {
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })

    it('should queue delivery of the appeal brief filed against this ruling order', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          caseId,
          elementId: briefFileId,
        }),
      )
    })

    it('should queue the appeal notification for the ruling-order appeal', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          elementId: appealCaseId,
          body: { type: AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
        }),
      )
    })

    it('should queue nothing else', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledTimes(2)
    })

    it('should record an APPEALED event tied to the represented defendant', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.OUT_OF_COURT,
          userRole: UserRole.DEFENDER,
          userId: undefined,
          defendantId,
          nationalId: defender.nationalId,
          userName: defender.name,
          userTitle: defender.title,
          institutionName: defender.institution?.name,
        },
        { transaction },
      )
    })
  })

  describe('defence user appeals a ruling order on a non-indictment case', () => {
    const rulingFileId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      state: 'RECEIVED',
      caseFiles: [],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, { rulingFileId })
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'Only indictment cases support ruling-order appeals',
      )
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
    })
  })
})
