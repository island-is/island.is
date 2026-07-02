import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseState,
  AppealEventType,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
} from '../../../repository'
import { CreateAppealCaseDto } from '../../dto/createAppealCase.dto'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (theCase: Case, user: User) => Promise<Then>

describe('AppealCaseController - Create', () => {
  const caseId = uuid()
  const appealCaseId = uuid()

  const prosecutor = {
    id: uuid(),
    role: UserRole.PROSECUTOR,
    nationalId: '0000000000',
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  } as User

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: '1111111111',
  } as User

  const createdAppealCase = { id: appealCaseId, caseId } as AppealCase

  const now = new Date('2024-01-15T10:00:00Z')

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      appealDecisionRepositoryService,
      appealEventLogRepositoryService,
      caseRepositoryService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockCaseRepositoryService = caseRepositoryService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockCreate = mockAppealCaseRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue(createdAppealCase)

    givenWhenThen = async (theCase, user) => {
      const then = {} as Then

      const dto: CreateAppealCaseDto = {}

      await appealCaseController
        .create(caseId, user, theCase, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('prosecution user appeals a restriction case', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      caseFiles: [],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, prosecutor)
    })

    it('should create an appealed appeal case', () => {
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        { appealState: AppealCaseState.APPEALED, appealDate: now },
        { transaction },
      )
      expect(then.result).toBe(createdAppealCase)
    })

    it('should not touch appeal_decision rows for an out-of-court appeal', () => {
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })

    it('should record an APPEALED event with the actor snapshot incl. user id', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          userRole: UserRole.PROSECUTOR,
          userId: prosecutor.id,
          nationalId: prosecutor.nationalId,
          userName: prosecutor.name,
          userTitle: prosecutor.title,
          institutionName: prosecutor.institution?.name,
        },
        { transaction },
      )
    })

    it('should stamp the prosecutor postponed appeal date on the case', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({
          prosecutorPostponedAppealDate: now,
        }),
        { transaction },
      )
    })

    it('should queue the appeal to court of appeals notification', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          body: {
            type: AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS,
          },
        }),
      )
    })
  })

  describe('defence user appeals a restriction case', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      caseFiles: [],
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(theCase, defender)
    })

    it('should stamp the accused postponed appeal date on the case', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({
          accusedPostponedAppealDate: now,
        }),
        { transaction },
      )
    })
  })

  describe('prosecution user appeals a non-dismissed indictment case', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      caseFiles: [],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, prosecutor)
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'Only dismissed indictment cases can be appealed',
      )
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('appeal brief case files are delivered to court', () => {
    const rvgFileId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      caseFiles: [
        {
          id: rvgFileId,
          state: CaseFileState.STORED_IN_RVG,
          isKeyAccessible: true,
          category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
        },
      ],
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(theCase, prosecutor)
    })

    it('should queue delivery of the appeal brief file', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          caseId,
          elementId: rvgFileId,
        }),
      )
    })
  })
})
