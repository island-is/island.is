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
  CaseFileCategory,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import {
  AppealCase,
  AppealCaseRepositoryService,
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
  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      limitedAccessAppealCaseController,
      appealCaseRepositoryService,
      caseRepositoryService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
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
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      caseFiles: [],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase)
    })

    it('should create an appealed appeal case', () => {
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        { appealState: AppealCaseState.APPEALED },
        { transaction },
      )
      expect(then.result).toBe(createdAppealCase)
    })

    it('should stamp the accused postponed appeal date on the case', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({ accusedPostponedAppealDate: now }),
        { transaction },
      )
    })

    it('should queue the appeal to court of appeals notification', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.NOTIFICATION,
          caseId,
          body: { type: AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
        }),
      )
    })
  })

  describe('defence user appeals a ruling order on an indictment case', () => {
    const rulingFileId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: 'RECEIVED',
      caseFiles: [
        {
          id: rulingFileId,
          category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        },
      ],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, { rulingFileId })
    })

    it('should create a ruling-order appeal tagged with the appellant', () => {
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          appealState: AppealCaseState.APPEALED,
          rulingFileId,
          appealedByNationalId: defenderNationalId,
        },
        { transaction },
      )
      expect(then.result).toBe(createdAppealCase)
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
